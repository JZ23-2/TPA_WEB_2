package query

import (
	"net/http"

	"github.com/JZ23-2/TPAWEB_TraveloHI/connection"
	"github.com/JZ23-2/TPAWEB_TraveloHI/helper"
	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
)

func GetQuestion(c *gin.Context) {
	db := connection.GetDB()
	var questions []model.Question
	db.Find(&questions)

	c.JSON(http.StatusOK, questions)
}

func GetAnswer(c *gin.Context) {
	var questionDetail model.QuestionDetail

	if err := c.Bind(&questionDetail); err != nil {
		c.String(http.StatusBadRequest, "Invalid Request")
		return
	}

	answer, err := CheckAnswerQuestion(questionDetail.UserID, questionDetail.QuestionID)
	if err != nil {
		c.String(http.StatusInternalServerError, "Question Not Valid")
		return
	}

	if err := helper.ComparePassword(answer.Answer, questionDetail.Answer); err != nil {
		c.String(http.StatusInternalServerError, "Answer Not Valid")
		return
	}

	c.String(http.StatusOK, "Answer Valid")

}

func CheckAnswerQuestion(userID uint, questionID uint) (*model.QuestionDetail, error) {
	db := connection.GetDB()
	var questionDetail model.QuestionDetail
	if err := db.Where("user_id = ? AND question_id = ?", userID, questionID).First(&questionDetail).Error; err != nil {
		return nil, err
	}
	return &questionDetail, nil
}
