package middlewares

import (
	"context"
	"net/http"

	my_auth "github.com/JZ23-2/TPAWEB_TraveloHI/auth"

	"github.com/gin-gonic/gin"
)

type AuthString string

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		req := ctx.Request

		auth := req.Header.Get("Authorization")

		if auth == "" {
			ctx.Next()
			return
		}

		bearer := "Bearer "
		auth = auth[len(bearer):]

		validate, err := my_auth.ValidateJWT(context.Background(), auth)
		if err != nil || !validate.Valid {
			ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Invalid Token"})
			return
		}
		customClaim, _ := validate.Claims.(*my_auth.JWTCustomClaim)

		ctx.Set("auth", customClaim)

		ctx.Next()
	}
}

func CtxValue(ctx context.Context) *my_auth.JWTCustomClaim {
	raw, _ := ctx.Value(AuthString("auth")).(*my_auth.JWTCustomClaim)
	return raw
}
