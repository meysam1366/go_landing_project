package controllers

import (
	"fmt"
	"math/rand"
	"net/http"
	"strings"

	"github.com/christophwitzko/go-curl"
	"github.com/revel/revel"
	"gopkg.in/resty.v1"
)

type App struct {
	*revel.Controller
}

func (c App) Index() revel.Result {
	return c.Render()
}

func (c App) About() revel.Result {
	return c.Render()
}

func (c App) Landing() revel.Result {
	// data := make(map[string]interface{})
	// service := c.Params.Route.Get("service")
	// version := c.Params.Route.Get("version")
	// data["service"] = service
	// data["version"] = version

	// return c.RenderJSON(data)
	return c.Render()
}

func (c App) Verify() revel.Result {

	msisdn := c.Params.Get("msisdn")

	url := "http://panel.techvas.com/api/member/sub"

	cb := func(st curl.IoCopyStat) error {
		fmt.Println(st.Stat)
		if st.Response != nil {
			fmt.Println(st.Response.Status)
		}
		return nil
	}
	err, str, resp := curl.String(
		url, cb, "method=", "POST",
		"data=", strings.NewReader("mobile="+msisdn+"&sid=ce89bda3-b734-11e7-9915-005056964f7a"),
		"disablecompression=", true, //application/x-www-form-urlencoded
		"header=", http.Header{"Authorization": {"key=a08a371b-b733-11e7-9915-005056964f7a"}, "Content-Type": {"application/x-www-form-urlencoded"}},
	)
	if err != nil {
		// fmt.Println(err)
		// return
	}
	if resp.StatusCode != 200 {
		fmt.Println(str)
	}
	// fmt.Println(resp.Header)
	// fmt.Println(str)
	messages := []rune(str)
	substring := string(messages[0:7])

	fmt.Println(str)

	data := make(map[string]interface{})

	if substring == "SUCCESS" {
		message := "SUCCESS"
		tids := []rune(str)
		tid := string(tids[8:15])
		data["message"] = message
		data["tid"] = tid
		// return c.RenderJSON(tid)
	} else {
		data["error"] = str
	}

	// random := RandStringBytes(8)

	return c.RenderJSON(data)

}

func (c App) Thanks() revel.Result {
	pin := c.Params.Get("pin")
	tid := c.Params.Get("tid")

	data := make(map[string]interface{})
	data["pin"] = pin
	data["tid"] = tid

	url := "http://panel.techvas.com/api/member/check"

	cb := func(st curl.IoCopyStat) error {
		fmt.Println(st.Stat)
		if st.Response != nil {
			fmt.Println(st.Response.Status)
		}
		return nil
	}
	err, str, resp := curl.String(
		url, cb, "method=", "POST",
		"data=", strings.NewReader("tid="+tid+"&pin="+pin),
		"disablecompression=", true, //application/x-www-form-urlencoded
		"header=", http.Header{"Authorization": {"key=a08a371b-b733-11e7-9915-005056964f7a"}, "Content-Type": {"application/x-www-form-urlencoded"}},
	)
	if err != nil {
		// fmt.Println(err)
		// return
	}
	if resp.StatusCode == 200 {
		fmt.Println(str)
	}

	return c.RenderJSON(str)
}

func handler(w http.ResponseWriter, req *http.Request) {
	// ...
	enableCors(&w)
	// ...
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func printOutput(resp *resty.Response, err error) {
	fmt.Println(resp, err)
}

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func RandStringBytes(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}
