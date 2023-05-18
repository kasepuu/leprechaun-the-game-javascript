package main

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
	"strings"
)

var temp *template.Template //temp variable for editable webpage

func main() {

	portFromFile, err := os.ReadFile("port.txt")
	firstlineCheck := StringControl(string(strings.Split(string(portFromFile), "\n")[0]))
	port := string(strings.Split(string(portFromFile), "\n")[0]) //port value
	if err != nil || firstlineCheck == false {
		fmt.Println("<port.txt> file not found or corrupt, please enter port for webserver manually:")
		fmt.Scanln(&port)
	}

	http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("")))) //for handling web folder

	//serverlistener
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		fmt.Println(err)
		os.Exit(0)
	}
}

func serverHandle(resp http.ResponseWriter, req *http.Request) {
	if req.Method == "GET" {
		temp.ExecuteTemplate(resp, "index.html", 0) //setting up the main page, and waiting for user input (POST)
	}
}

// function that checks string for letters
func StringControl(str string) bool {
	success := false
	for i := 0; i < len(str); i++ {
		if rune(str[i]) < '0' || rune(str[i]) > '9' {
			success = false
		} else {
			success = true
		}
	}
	return success
}
