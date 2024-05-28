package connection

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func GetDB() *gorm.DB {
	if db == nil {
		dsn := "host=localhost user=postgres password=818014 dbname=travelohi port=5432 sslmode=disable TimeZone=Asia/Bangkok"
		new_db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			panic(err)
		}
		db = new_db
	}
	return db
}
