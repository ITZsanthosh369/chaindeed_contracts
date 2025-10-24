# Test IPFS URLs Script
# This script tests both the working and non-working IPFS image URLs

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ChainDeed IPFS Image URL Tester" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define the URLs
$oldCertUrl = "https://gateway.pinata.cloud/ipfs/bafkreihcxeabkbsk7uj7ydpdz2fmt2rchldcb7pnexc566klky4bxrbgiu"
$newCertUrl = "https://gateway.pinata.cloud/ipfs/bafkreico3tz2nftkwjdv4pagc2bfy2rk3ny6dgnubhnwsc6j3vjhhzblsu"

# Test function
function Test-IPFSUrl {
    param (
        [string]$Url,
        [string]$Name
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    Write-Host ""
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        
        Write-Host "SUCCESS" -ForegroundColor Green
        Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor Green
        Write-Host "Content-Length: $($response.Headers['Content-Length']) bytes" -ForegroundColor Green
        
        # Try to determine if it is an image
        $contentType = $response.Headers['Content-Type']
        if ($contentType -like "*image*") {
            Write-Host "File Type: IMAGE" -ForegroundColor Green
        } else {
            Write-Host "File Type: $contentType (NOT AN IMAGE)" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "FAILED" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host ""
}

# Test both URLs
Test-IPFSUrl -Url $oldCertUrl -Name "OLD Certificate (TDS - WORKING)"
Test-IPFSUrl -Url $newCertUrl -Name "NEW Certificate (Dr. Principal - NOT WORKING)"

# Alternative gateways test
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Alternative IPFS Gateways" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$newHash = "bafkreico3tz2nftkwjdv4pagc2bfy2rk3ny6dgnubhnwsc6j3vjhhzblsu"
$gateways = @(
    "https://ipfs.io/ipfs/",
    "https://cloudflare-ipfs.com/ipfs/",
    "https://dweb.link/ipfs/"
)

foreach ($gateway in $gateways) {
    $testUrl = "$gateway$newHash"
    Write-Host "Gateway: $gateway" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $testUrl -Method Head -TimeoutSec 15 -UseBasicParsing -ErrorAction Stop
        Write-Host "Accessible - Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "Failed - $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary and Recommendations" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Check the results above" -ForegroundColor White
Write-Host "2. If NEW cert shows 404: File never uploaded to IPFS" -ForegroundColor White
Write-Host "3. If NEW cert shows timeout: IPFS propagation delay" -ForegroundColor White
Write-Host "4. If NEW cert shows wrong content-type: Upload format issue" -ForegroundColor White
Write-Host "5. If alternate gateways work: Switch gateway in code" -ForegroundColor White
Write-Host ""
