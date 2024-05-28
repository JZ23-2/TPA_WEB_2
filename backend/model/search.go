package model

type Search struct {
	SearchID      uint `gorm:"primaryKey;autoIncrement"`
	SearchKeyword string
}

type SearchDetail struct {
	UserID   uint
	SearchID uint
}

type SearchResult struct {
	SearchID      uint
	UserID        uint
	SearchKeyword string
}
