$KC = "http://localhost:8180"

function Get-KCToken {
    $resp = Invoke-RestMethod -Uri "$KC/realms/master/protocol/openid-connect/token" -Method Post -ContentType "application/x-www-form-urlencoded" -Body "username=admin&password=admin&grant_type=password&client_id=admin-cli"
    return $resp.access_token
}

function KC-Post($path, $body) {
    $token = Get-KCToken
    try {
        $resp = Invoke-RestMethod -Uri "$KC$path" -Method Post -Headers @{Authorization="Bearer $token"} -ContentType "application/json" -Body ($body | ConvertTo-Json -Depth 5)
        return "201"
    } catch {
        return $_.Exception.Response.StatusCode.value__
    }
}

function KC-Get($path) {
    $token = Get-KCToken
    return Invoke-RestMethod -Uri "$KC$path" -Method Get -Headers @{Authorization="Bearer $token"}
}

function KC-PostRaw($path, $jsonString) {
    $token = Get-KCToken
    try {
        Invoke-RestMethod -Uri "$KC$path" -Method Post -Headers @{Authorization="Bearer $token"} -ContentType "application/json" -Body $jsonString
        return "204"
    } catch {
        return $_.Exception.Response.StatusCode.value__
    }
}

# 1. Create client
Write-Host "=== Creating client: gateway-client ===" -ForegroundColor Cyan
$clientBody = @{
    clientId = "gateway-client"
    enabled = $true
    publicClient = $true
    directAccessGrantsEnabled = $true
    standardFlowEnabled = $true
    redirectUris = @("http://localhost/*", "http://localhost:5173/*")
    webOrigins = @("http://localhost", "http://localhost:5173", "*")
    protocol = "openid-connect"
}
$code = KC-Post "/admin/realms/smart-university/clients" $clientBody
Write-Host "  Client: HTTP $code"

# 2. Create roles
Write-Host "`n=== Creating realm roles ===" -ForegroundColor Cyan
foreach ($role in @("ADMIN", "TEACHER", "STUDENT")) {
    $code = KC-Post "/admin/realms/smart-university/roles" @{name=$role}
    Write-Host "  Role ${role}: HTTP $code"
}

# 3. Create users and assign roles
$users = @(
    @{ username="admin1";   password="admin123";   role="ADMIN" },
    @{ username="teacher1"; password="teacher123"; role="TEACHER" },
    @{ username="student1"; password="student123"; role="STUDENT" }
)

Write-Host "`n=== Creating users ===" -ForegroundColor Cyan
foreach ($u in $users) {
    $userBody = @{
        username = $u.username
        enabled = $true
        emailVerified = $true
        credentials = @(@{
            type = "password"
            value = $u.password
            temporary = $false
        })
    }
    $code = KC-Post "/admin/realms/smart-university/users" $userBody
    Write-Host "  User $($u.username): HTTP $code"

    # Get user ID
    $foundUsers = KC-Get "/admin/realms/smart-university/users?username=$($u.username)&exact=true"
    if ($foundUsers -and $foundUsers.Count -gt 0) {
        $userId = $foundUsers[0].id
        Write-Host "    ID: $userId"

        # Get role representation and assign
        $roleObj = KC-Get "/admin/realms/smart-university/roles/$($u.role)"
        $roleJson = "[$($roleObj | ConvertTo-Json -Compress)]"
        $code = KC-PostRaw "/admin/realms/smart-university/users/$userId/role-mappings/realm" $roleJson
        Write-Host "    Role $($u.role) assigned: HTTP $code"
    } else {
        Write-Host "    ERROR: Could not find user $($u.username)" -ForegroundColor Red
    }
}

Write-Host "`n=== Keycloak setup complete! ===" -ForegroundColor Green
Write-Host "Realm: smart-university"
Write-Host "Client: gateway-client (public)"
Write-Host "Users: admin1 (ADMIN), teacher1 (TEACHER), student1 (STUDENT)"
