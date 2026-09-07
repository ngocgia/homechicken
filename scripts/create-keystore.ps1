param(
    [string]$KeystorePass = "HomeChicken@2026",
    [string]$KeyAlias = "homechicken"
)

$keystorePath = "d:\homechicken\android\release-key.jks"
$propsPath = "d:\homechicken\android\keystore.properties"

if (Test-Path $keystorePath) {
    Write-Host "Keystore already exists at: $keystorePath" -ForegroundColor Yellow
} else {
    Write-Host "Generating release Keystore for Google Play..." -ForegroundColor Cyan
    $keytoolArgs = @(
        "-genkeypair",
        "-v",
        "-keystore", $keystorePath,
        "-alias", $KeyAlias,
        "-keyalg", "RSA",
        "-keysize", "2048",
        "-validity", "10000",
        "-storepass", $KeystorePass,
        "-keypass", $KeystorePass,
        "-dname", "CN=Home Chicken POS, OU=Tech, O=HomeChicken, L=HoChiMinh, ST=VN, C=VN"
    )

    & keytool.exe @keytoolArgs

    if (Test-Path $keystorePath) {
        Write-Host "Keystore generated successfully: $keystorePath" -ForegroundColor Green
    } else {
        Write-Error "Failed to create Keystore!"
        exit 1
    }
}

# Generate keystore.properties for Gradle
$propsContent = "storeFile=../release-key.jks`r`nstorePassword=$KeystorePass`r`nkeyAlias=$KeyAlias`r`nkeyPassword=$KeystorePass`r`n"
[System.IO.File]::WriteAllText($propsPath, $propsContent, [System.Text.Encoding]::UTF8)

Write-Host "Generated keystore.properties successfully: $propsPath" -ForegroundColor Green
Write-Host "--------------------------------------------------------"
Write-Host "YOUR GOOGLE PLAY SIGNING CREDENTIALS:" -ForegroundColor Yellow
Write-Host "Keystore File: $keystorePath"
Write-Host "Keystore Password: $KeystorePass"
Write-Host "Key Alias: $KeyAlias"
Write-Host "Key Password: $KeystorePass"
Write-Host "IMPORTANT: Keep release-key.jks safe! Losing it means you cannot update your app on Google Play." -ForegroundColor Red
Write-Host "--------------------------------------------------------"
