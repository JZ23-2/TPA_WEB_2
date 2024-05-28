package model

type Promo struct {
	PromoID          uint `gorm:"primaryKey;autoIncrement"`
	PromoName        string
	PromoCode        string
	PromoDescription string
	PromoBenefit     int
	PromoPicture     string
}

type NewLetter struct{
	NewLetterContent string
}