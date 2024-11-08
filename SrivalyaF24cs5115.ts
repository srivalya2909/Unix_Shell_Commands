Script started on 2024-11-05 11:29:12+05:30 [TERM="xterm-256color" TTY="/dev/pts/2" COLUMNS="120" LINES="30"]
[?2004h]0;pida5e7@c623lrd83149980: ~/test[01;32mpida5e7@c623lrd83149980[00m:[01;34m~/test[00m$ ls
[?2004lMakefile  SrivalyaF24cs5115.ts  Srivalya_shell.c
[?2004h]0;pida5e7@c623lrd83149980: ~/test[01;32mpida5e7@c623lrd83149980[00m:[01;34m~/test[00m$ cat Srivalya_shell.c 
[?2004l#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>
#include <fcntl.h>

#define MAX_ARGS 10
#define MAX_CMD_LEN 1024

// Function to execute a command (question 1)
void execute_command(char **args, int background) {
    pid_t pid = fork();

    if (pid == 0) {
        // Child process
        execvp(args[0], args);
        perror("Error executing command"); // Error handling (Question 7)
        exit(1);
    } else if (pid > 0) {
        // Parent process
        if (!background) {
            wait(NULL); // Wait for child process if not background (Question 4)
        }
    } else {
        perror("fork failed"); // Error handling (Question 7)
    }
}

// Function to handle I/O redirection (question 5)
void handle_io_redirection(char **args) {
    int i = 0;
    while (args[i] != NULL) {
        if (strcmp(args[i], ">") == 0) { // Output redirection
            int fd = open(args[i + 1], O_WRONLY | O_CREAT | O_TRUNC, 0644);
            dup2(fd, STDOUT_FILENO);
            close(fd);
            args[i] = NULL; // Remove redirection symbols from args
        } else if (strcmp(args[i], "<") == 0) { // Input redirection
            int fd = open(args[i + 1], O_RDONLY);
            dup2(fd, STDIN_FILENO);
            close(fd);
            args[i] = NULL;
        }
        i++;
    }
}

// Function to handle piping between two commands (question 6)
void execute_pipe(char **args1, char **args2) {
    int pipefd[2];
    pipe(pipefd);
    pid_t pid1 = fork();

    if (pid1 == 0) {
        // First command (write end)
        dup2(pipefd[1], STDOUT_FILENO);
        close(pipefd[0]);
        close(pipefd[1]);
        execvp(args1[0], args1);
        perror("Error executing first command in pipe"); // Error handling (Question 7)
        exit(1);
    }

    pid_t pid2 = fork();
    if (pid2 == 0) {
        // Second command (read end)
        dup2(pipefd[0], STDIN_FILENO);
        close(pipefd[1]);
        close(pipefd[0]);
        execvp(args2[0], args2);
        perror("Error executing second command in pipe"); // Error handling (Question 7)
        exit(1);
    }

    close(pipefd[0]);
    close(pipefd[1]);
    waitpid(pid1, NULL, 0); // Wait for first command to finish
    waitpid(pid2, NULL, 0); // Wait for second command to finish
}

int main() {
    char input[MAX_CMD_LEN];
    char *args[MAX_ARGS];
    char *args_pipe[MAX_ARGS];

    while (1) {
        // Display prompt (Covers question 2)
        printf("Srivalya_shell> ");
        fflush(stdout);

        if (fgets(input, MAX_CMD_LEN, stdin) == NULL) {
            break; // EOF or error
        }

        input[strcspn(input, "\n")] = '\0'; // Remove newline

        // Exit built-in command (question 8: exit)
        if (strcmp(input, "exit") == 0) {
            break;
        }
        
        // Clear screen built-in command (question 8: clear)
        if (strcmp(input, "clear") == 0) {
            system("clear");
            continue;
        }

        // Command parsing and handling (question 3)
        int background = 0;
        int is_pipe = 0;
        int i = 0;
        char *token = strtok(input, " ");
        
        while (token != NULL) {
            if (strcmp(token, "&") == 0) { // Background execution (Question 4)
                background = 1;
                break;
            } else if (strcmp(token, "|") == 0) { // Pipe detection (Question 6)
                is_pipe = 1;
                args[i] = NULL;
                i = 0;
                token = strtok(NULL, " ");
                continue;
            } else if (strcmp(token, "cd") == 0) { // Change directory built-in (question 8: cd)
                token = strtok(NULL, " ");
                if (chdir(token) != 0) {
                    perror("cd failed"); // Error handling for cd (Question 7)
                }
                break;
            }

            if (!is_pipe) {
                args[i++] = token; // Parse first command
            } else {
                args_pipe[i++] = token; // Parse second command for pipe
            }
            
            token = strtok(NULL, " ");
        }
        
        if (is_pipe) {
            args[i] = NULL;
            args_pipe[i] = NULL;
            execute_pipe(args, args_pipe); // Execute pipe (Question 6)
        } else {
            args[i] = NULL;
            handle_io_redirection(args); // Handle I/O redirection (Question 5)
            execute_command(args, background); // Execute command (Question 1, 4)
        }
    }

    return 0;
}
[?2004h]0;pida5e7@c623lrd83149980: ~/test[01;32mpida5e7@c623lrd83149980[00m:[01;34m~/test[00m$ cat Makefile 
[?2004l# Makefile for Srivalya_shell assignment

# Compiler and flags
CC = gcc
CFLAGS = -Wall -Wextra

# Target executable name
TARGET = Srivalya_shell

# Default target to build the shell
all: $(TARGET)

# Rule to compile the shell program
$(TARGET): Srivalya_shell.c
	@echo "Compiling $(TARGET)..."
	$(CC) $(CFLAGS) Srivalya_shell.c -o $(TARGET)
	@echo "Compilation complete. Run with ./$(TARGET)"

# Clean up object files and the executable
clean:
	@echo "Cleaning up..."
	rm -f $(TARGET)
	@echo "All cleaned up!"
[?2004h]0;pida5e7@c623lrd83149980: ~/test[01;32mpida5e7@c623lrd83149980[00m:[01;34m~/test[00m$ make
[?2004lCompiling Srivalya_shell...
gcc -Wall -Wextra Srivalya_shell.c -o Srivalya_shell
Compilation complete. Run with ./Srivalya_shell
[?2004h]0;pida5e7@c623lrd83149980: ~/test[01;32mpida5e7@c623lrd83149980[00m:[01;34m~/test[00m$ ls
[?2004lMakefile  SrivalyaF24cs5115.ts  [0m[01;32mSrivalya_shell[0m  Srivalya_shell.c
[?2004h]0;pida5e7@c623lrd83149980: ~/test[01;32mpida5e7@c623lrd83149980[00m:[01;34m~/test[00m$ [7m./Srivalya_shell[27m./Srivalya_shell
[?2004lSrivalya_shell> ls
Makefile  SrivalyaF24cs5115.ts	Srivalya_shell	Srivalya_shell.c
Srivalya_shell> ls -l
total 36
-rw-rw-r-- 1 pida5e7 domainusers   510 Nov  5 11:17 Makefile
-rw-rw-r-- 1 pida5e7 domainusers  4096 Nov  5 11:29 SrivalyaF24cs5115.ts
-rwxrwxr-x 1 pida5e7 domainusers 16952 Nov  5 11:29 Srivalya_shell
-rw-rw-r-- 1 pida5e7 domainusers  4559 Nov  5 11:07 Srivalya_shell.c
Srivalya_shell> sleep 5 &
Srivalya_shell> ls | grep output
Srivalya_shell> foobar
Srivalya_shell> Error executing command: No such file or directory

Srivalya_shell> make clean
Srivalya_shell> Cleaning up...
rm -f Srivalya_shell
All cleaned up!

Srivalya_shell> ls
Srivalya_shell> Makefile  SrivalyaF24cs5115.ts	Srivalya_shell.c

Srivalya_shell> exit
[?2004h]0;pida5e7@c623lrd83149980: ~/test[01;32mpida5e7@c623lrd83149980[00m:[01;34m~/test[00m$ exit
[?2004lexit

Script done on 2024-11-05 11:31:26+05:30 [COMMAND_EXIT_CODE="0"]
