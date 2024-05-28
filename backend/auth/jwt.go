package auth

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type JWTCustomClaim struct {
	ID int
	jwt.StandardClaims
}

func GetJWTKey() string {
	key := os.Getenv("JWT_KEY")
	if key == "" {
		key = "TPAWEB232"
	}
	return key
}

var myJWTKey = []byte(GetJWTKey())

func GenerateJWT(userID int) (string, error) {
	temp := jwt.NewWithClaims(jwt.SigningMethodHS256, &JWTCustomClaim{
		ID: userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute * 10).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
	})

	token, err := temp.SignedString(myJWTKey)
	if err != nil {
		return "", err
	}
	return token, nil
}

func ValidateJWT(ctx context.Context, token string) (*jwt.Token, error) {
	return jwt.ParseWithClaims(token, &JWTCustomClaim{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Can't sign-in")
		}
		return myJWTKey, nil
	})
}
