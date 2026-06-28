Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap('c:\MyWorkSpace\GenAIJobhub\public\logo.png')
# find a non-transparent pixel by scanning
$w = $bmp.Width
$h = $bmp.Height
$targetColor = $null

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.A -gt 200 -and $pixel.R -gt 50 -and $pixel.B -gt 100) {
            $targetColor = $pixel
            break
        }
    }
    if ($targetColor) { break }
}

if ($targetColor) {
    Write-Output ('#{0:X2}{1:X2}{2:X2}' -f $targetColor.R, $targetColor.G, $targetColor.B)
} else {
    Write-Output "Color not found"
}
