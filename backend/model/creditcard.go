package model

type CreditCard struct {
	CreditID         uint `gorm:"primaryKey;autoIncrement"`
	CreditCardNumber string
	Status           int
}

type RegistCreditCard struct {
	UserID           uint
	CreditCardNumber string
	Status           int
}
