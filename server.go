package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type ScoreBoard struct {
	Player string `json:"player"`
	Score  int    `json:"score"`
	Time   string `json:"time"`
}

type ScoreBoardArray []ScoreBoard

var Scores ScoreBoardArray

func main() {

	portFromFile, err := os.ReadFile("game/templates/port.txt")
	firstlineCheck := StringControl(string(strings.Split(string(portFromFile), "\n")[0]))
	port := string(strings.Split(string(portFromFile), "\n")[0]) //port value
	if err != nil || !firstlineCheck {
		fmt.Println("path: /game/templates/port.txt")
		fmt.Println("<port.txt> file not found or corrupt, please enter port for webserver manually:")
		fmt.Scanln(&port)
	}

	getHighScores() // fetching all of the highscores found in .json

	http.Handle("/game/", http.StripPrefix("/game", http.FileServer(http.Dir("./game"))))
	http.HandleFunc("/", serverHandle)
	http.HandleFunc("/ws", wsHandler)

	//serverlistener
	log.Printf("Starting server at port " + port + "\n\n")
	log.Printf("http://localhost:" + port + "/\n")
	errorHandler(http.ListenAndServe(":"+port, nil))
}

func getHighScores() error {
	scores, err := os.ReadFile("highscores.json")
	if err != nil {
		return err
	}

	err = json.Unmarshal(scores, &Scores)
	if err != nil {
		return err
	}
	return nil
}

func sortHighScores() {
	sort.Slice(Scores, func(i, j int) bool {
		return Scores[i].Score > Scores[j].Score
	})
}

func addHighScore() error {
	data, err := json.MarshalIndent(Scores, "", "   ")
	errorHandler(err)
	err = os.WriteFile("highscores.json", data, 0644)
	errorHandler(err)

	return nil
}

func serverHandle(resp http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		resp.WriteHeader(404)
		return
	}

	if r.Method == "GET" {
		createAndExecute(resp, "index.html")
	} else if r.Method == "POST" {
		fmt.Println("Post request has been received!")

		player := r.FormValue("name_input")
		time := r.FormValue("final_timer")
		score, err := strconv.Atoi(r.FormValue("final_score"))
		if player != "" && time != "" && err == nil {
			fmt.Println("data:", player, score, time)

			getHighScores() // getting updated data

			Scores = append(Scores, ScoreBoard{player, score, time})

			sortHighScores() // by score (default)

			errorHandler(addHighScore())
		}

		http.Redirect(resp, r, "/", http.StatusSeeOther)
	}

}
func wsHandler(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	errorHandler(err)

	defer conn.Close()

	err = conn.WriteJSON(Scores) // Send the Scores variable to the client
	errorHandler(err)
}

func createAndExecute(w http.ResponseWriter, fileName string) {
	page, err := template.New("index.html").ParseFiles("game/templates/index.html", fmt.Sprint("game/templates/", fileName))
	if err != nil {
		fmt.Println(err.Error())
		createAndExecuteError(w, "500 Internal Server Error")
		return
	}
	err = page.Execute(w, "")
	if err != nil {
		createAndExecuteError(w, "500 Internal Server Error")
		fmt.Println(err.Error())
		return
	}
}
func createAndExecuteError(w http.ResponseWriter, msg string) {
	page, _ := template.New("index.html").ParseFiles("game/templates/index.html", fmt.Sprint("game/templates/", "error.html"))
	page.Execute(w, "error")
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

// error check
func errorHandler(err error) {
	if err != nil {
		log.Println(err)
		return
	}
}
