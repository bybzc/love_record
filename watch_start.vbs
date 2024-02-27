Set objShell = CreateObject("WScript.Shell")

' 获取当前脚本文件的完整路径
strScriptPath = objShell.CurrentDirectory & "\" & WScript.ScriptFullName

' 获取当前脚本文件所在目录的路径
strScriptDirectory = objShell.CurrentDirectory & "\"

' 构建相对路径，假设你的可执行文件位于脚本所在目录下的 SubFolder 文件夹中
strRelativePath = "./watch_it.exe"

' 使用相对路径启动程序
objShell.Run strScriptDirectory & strRelativePath, 0, False

Set objShell = Nothing