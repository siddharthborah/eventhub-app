package signup

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// Handler for our signup.
func Handler(ctx *gin.Context) {
	// Generate random state
	state, err := generateRandomState()
	if err != nil {
		ctx.String(http.StatusInternalServerError, err.Error())
		return
	}

	// Save the state inside the session
	session := sessions.Default(ctx)
	session.Set("state", state)
	if err := session.Save(); err != nil {
		ctx.String(http.StatusInternalServerError, err.Error())
		return
	}

	// Construct the Auth0 signup URL with state parameter
	signupURL := "https://" + os.Getenv("AUTH0_DOMAIN") + "/authorize?" +
		"response_type=code" +
		"&client_id=" + os.Getenv("AUTH0_CLIENT_ID") +
		"&redirect_uri=" + os.Getenv("AUTH0_CALLBACK_URL") +
		"&scope=openid%20profile%20email" +
		"&state=" + state +
		"&screen_hint=signup"

	ctx.Redirect(http.StatusTemporaryRedirect, signupURL)
}

func generateRandomState() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}

	state := base64.StdEncoding.EncodeToString(b)
	return state, nil
}
