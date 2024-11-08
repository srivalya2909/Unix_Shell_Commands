#include <stdio.h>
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
