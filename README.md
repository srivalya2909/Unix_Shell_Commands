
# Srivalya Shell

This project is a simple Unix shell implemented in C for the **CS 5115 Fall 2024 HW3** assignment. The shell supports basic command execution, background processes, I/O redirection, pipes, and built-in commands such as `cd`, `clear`, and `exit`.

## How to Compile and Run

1. **Compile the Shell Program**
   - Use the provided `Makefile` to compile the shell. In the terminal, navigate to the directory containing `Srivalya_shell.c` and `Makefile`, then run:
     ```bash
     make
     ```
   - This will generate an executable file named `Srivalya_shell`.

2. **Run the Shell Program**
   - To start the shell, execute the following command in the terminal:
     ```bash
     ./Srivalya_shell
     ```
   - You should see a prompt appear, e.g., `Srivalya_shell>`, where you can start entering commands.

3. **Exit the Shell**
   - Type `exit` and press Enter to exit the shell.

## Known Issues and Limitations

- **Limited Pipe Support**: The shell currently supports only one pipe (`|`) between two commands. Chaining multiple pipes (e.g., `command1 | command2 | command3`) is not implemented.
- **Basic I/O Redirection**: The shell supports basic input (`<`) and output (`>`) redirection. Compound redirections (e.g., both input and output redirection in the same command) are not fully tested.
- **No Advanced Job Control**: The shell does not support advanced job control features like `jobs`, `fg`, and `bg`.
- **Error Messages**: Limited error handling for complex cases (e.g., incorrect command syntax). The shell may produce generic error messages.
- **No Command History**: The shell does not support command history, so you cannot scroll through previously entered commands.
- **No Signal Handling**: Signals such as `Ctrl+C` are not handled, meaning `Ctrl+C` will terminate the shell instead of stopping the current command.

## Features and Supported Commands

- **Basic Commands**: The shell can execute standard Unix commands, such as `ls`, `cat`, `echo`, etc.
- **Background Execution**: You can run commands in the background using the `&` symbol, e.g., `sleep 5 &`.
- **I/O Redirection**:
  - Redirect output to a file using `>`, e.g., `ls > output.txt`.
  - Redirect input from a file using `<`, e.g., `cat < input.txt`.
- **Pipes**: The shell supports single pipes between two commands, e.g., `ls | grep "test"`.
- **Built-in Commands**:
  - `cd [directory]`: Change the current directory.
  - `clear`: Clear the terminal screen.
  - `exit`: Exit the shell.

## Additional Features

- **Custom Prompt**: Displays a custom prompt (`Srivalya_shell>`) instead of the default system prompt.
- **Makefile for Easy Compilation**: The provided Makefile simplifies the compilation and cleanup process.

## Compilation and Cleanup

- **To Compile**: Use `make` to compile the shell.
- **To Clean Up**: Use `make clean` to remove the executable and any generated files.
  ```bash
  make clean
  ```

## Usage Examples

1. **Run a command**
   ```sh
   Srivalya_shell> ls -l
   ```

2. **Run a command in the background**
   ```sh
   Srivalya_shell> sleep 10 &
   ```

3. **Redirect output to a file**
   ```sh
   Srivalya_shell> ls > output.txt
   ```

4. **Pipe between two commands**
   ```sh
   Srivalya_shell> cat file.txt | grep "pattern"
   ```

5. **Use built-in commands**
   ```sh
   Srivalya_shell> cd /path/to/directory
   Srivalya_shell> clear
   Srivalya_shell> exit
   ```

---
