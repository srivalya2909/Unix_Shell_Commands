# Makefile for Srivalya_shell assignment

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
