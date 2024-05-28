package helper

import (
	"time"

	"github.com/pquerna/otp/totp"
)

func GenerateOTP(email string) (string, time.Time, error) {
	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "Travelohi",
		AccountName: email,
	})

	if err != nil {
		return "", time.Time{}, err
	}

	timeGenerated := time.Now()

	otp, err := totp.GenerateCode(key.Secret(), timeGenerated)
	if err != nil {
		return "", time.Time{}, err
	}

	return otp, timeGenerated, nil
}

func VerifyOTP(generatedOTP string, userOTP string) bool {
	if generatedOTP == userOTP {
		return true
	} else {
		return false
	}
}
