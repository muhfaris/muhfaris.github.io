# How to install Golang

## Linux

## Windows

1. Install the latest 64-bit Go MSI (https://golang.org/dl/)
2. Ensure the Go binaries in `C:\Go\bin` and in your environment. To check click `System, Advanced system settings, Environment Variables... and open Path under System variables`
3. Open Command Line (CMD) and type `go version`

### Setup Workspace
1. Create folder `bin`, 'pkg', 'src' in `C:\Projects\Go`
2. Create the *GOPATH environment variable* and reference your Go workspace path. To add, click `System, Advanced system settings, Environment Variables...` and click `New... under System variables`:
![alt text](assets/6ef223da-8a53-11e4-96bf-3cbbd9acf589.png "Path environment ")

Set the variable name to GOPATH and value to your Go workspace path (e.g. C:\Projects\Go):
![alt text](assets/feb28c94-8a53-11e4-9bf4-02728abe34e5.png "Set Path")

4. Check in Command line (cmd) and type `echo %GOPATH%`
