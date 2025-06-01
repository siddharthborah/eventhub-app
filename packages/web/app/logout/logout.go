package logout

import (
	"net/http"
	"net/url"
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// Handler for our logout.
func Handler(ctx *gin.Context) {
	// Clear the session
	session := sessions.Default(ctx)
	session.Clear()
	session.Save()

	// Construct the Auth0 logout URL
	logoutUrl, err := url.Parse("https://" + os.Getenv("AUTH0_DOMAIN") + "/v2/logout")
	if err != nil {
		ctx.String(http.StatusInternalServerError, err.Error())
		return
	}

	// Use the ngrok URL as the return URL
	returnTo, err := url.Parse(os.Getenv("AUTH0_CALLBACK_URL"))
	if err != nil {
		ctx.String(http.StatusInternalServerError, err.Error())
		return
	}

	// Remove the /callback path from the return URL
	returnTo.Path = ""

	parameters := url.Values{}
	parameters.Add("returnTo", returnTo.String())
	parameters.Add("client_id", os.Getenv("AUTH0_CLIENT_ID"))
	logoutUrl.RawQuery = parameters.Encode()

	ctx.Redirect(http.StatusTemporaryRedirect, logoutUrl.String())
}
