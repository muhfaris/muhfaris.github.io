# Fix issue bluetooth in ubuntu not detected

Several step to solve it:
1. Run this command to terminal
`dmesg | grep brcm`

2. Find driver key like `BCM43142A0-0a5c-216d`
3. Download driver from github repo `https://github.com/winterheart/broadcom-bt-firmware`
4. Copy it to the `/lib/firmware/brcm` folder
5. Restart
6. Turn of bluetooth
