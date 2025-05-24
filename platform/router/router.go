package router

import (
	"encoding/gob"
	"net/http"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"

	"01-Login/platform/authenticator"
	"01-Login/platform/controllers"
	"01-Login/platform/middleware"
	"01-Login/web/app/callback"
	"01-Login/web/app/home"
	"01-Login/web/app/login"
	"01-Login/web/app/logout"
	"01-Login/web/app/signup"
	"01-Login/web/app/user"
)

// New registers the routes and returns the router.
func New(auth *authenticator.Authenticator) *gin.Engine {
	router := gin.Default()

	// To store custom types in our cookies,
	// we must first register them using gob.Register
	gob.Register(map[string]interface{}{})

	store := cookie.NewStore([]byte("secret"))
	store.Options(sessions.Options{
		Path:     "/",
		MaxAge:   int(24 * time.Hour.Seconds()),
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	router.Use(sessions.Sessions("auth-session", store))

	// Serve static files
	router.Static("/static", "web/static")
	router.Static("/public", "web/static")
	router.LoadHTMLGlob("web/template/*")

	// Web routes (existing)
	router.GET("/", home.Handler)
	router.GET("/login", login.Handler(auth))
	router.GET("/signup", signup.Handler)
	router.GET("/callback", callback.Handler(auth))
	router.GET("/user", middleware.IsAuthenticated, user.Handler)
	router.GET("/logout", logout.Handler)

	// Initialize controllers
	userController := controllers.NewUserController()
	itemController := controllers.NewItemController()
	eventController := controllers.NewEventController()

	// API routes
	api := router.Group("/api")
	{
		// User routes
		users := api.Group("/users")
		{
			users.POST("", userController.CreateUser)
			users.GET("", userController.GetUsers)
			users.GET("/:id", userController.GetUser)
			users.PUT("/:id", userController.UpdateUser)
			users.DELETE("/:id", userController.DeleteUser)
			users.GET("/email/:email", userController.GetUserByEmail)
			users.GET("/:id/items", itemController.GetUserItems)
			users.GET("/:id/events", eventController.GetUserEvents)
		}

		// Item routes
		items := api.Group("/items")
		{
			items.POST("", itemController.CreateItem)
			items.GET("", itemController.GetItems)
			items.GET("/available", itemController.GetAvailableItems)
			items.GET("/search", itemController.SearchItems)
			items.GET("/:id", itemController.GetItem)
			items.PUT("/:id", itemController.UpdateItem)
			items.DELETE("/:id", itemController.DeleteItem)
		}

		// Event routes
		events := api.Group("/events")
		{
			events.POST("", eventController.CreateEvent)
			events.GET("", eventController.GetEvents)
			events.GET("/public", eventController.GetPublicEvents)
			events.GET("/upcoming", eventController.GetUpcomingEvents)
			events.GET("/search", eventController.SearchEvents)
			events.GET("/date-range", eventController.GetEventsByDateRange)
			events.GET("/:id", eventController.GetEvent)
			events.PUT("/:id", eventController.UpdateEvent)
			events.DELETE("/:id", eventController.DeleteEvent)
		}
	}

	return router
}
