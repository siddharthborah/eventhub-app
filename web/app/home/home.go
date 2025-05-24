package home

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// Handler for our home page.
func Handler(ctx *gin.Context) {
	session := sessions.Default(ctx)
	if session.Get("profile") != nil {
		ctx.Redirect(http.StatusSeeOther, "/user")
		return
	}
	ctx.HTML(http.StatusOK, "home.html", nil)
}
