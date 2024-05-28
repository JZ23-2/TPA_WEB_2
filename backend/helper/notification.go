package helper

import (
	"log"

	"gopkg.in/gomail.v2"
)

const CONFIG_SMTP_HOST = "smtp.gmail.com"
const CONFIG_SMTP_PORT = 587
const CONFIG_SENDER_NAME = "Travelohi <travelohi@gmail.com>"
const CONFIG_AUTH_EMAIL = "jacksontpa7@gmail.com"
const CONFIG_AUTH_PASSWORD = "cbdt thba rblo cmtm"

func SendVerification(to string, text string) {
	mailer := gomail.NewMessage()

	mailer.SetHeader("From", CONFIG_AUTH_EMAIL)
	mailer.SetHeader("To", to)
	mailer.SetHeader("Subject", "Travelohi Notification")
	body := text
	mailer.SetBody("text/plain", body)

	dialer := gomail.NewDialer(
		CONFIG_SMTP_HOST,
		CONFIG_SMTP_PORT,
		CONFIG_AUTH_EMAIL,
		CONFIG_AUTH_PASSWORD,
	)

	err := dialer.DialAndSend(mailer)
	if err != nil {
		log.Fatal(err.Error())
	}
	log.Println("Mail sent!")
}
