# Generate Showtimes Script
# Creates showtimes for all theaters for the entire week

Write-Host "🚀 Starting to generate showtimes..." -ForegroundColor Cyan

$startDate = "2026-01-06"
$endDate = "2026-01-12"
$url = "http://localhost:8080/api/Showtimes/auto-generate-range?startDate=$startDate&endDate=$endDate"

try {
    Write-Host "📡 Calling API: $url" -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri $url -Method Post -ContentType "application/json"
    
    Write-Host "`n✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Response: $response" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ ERROR!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host "`n📊 Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
