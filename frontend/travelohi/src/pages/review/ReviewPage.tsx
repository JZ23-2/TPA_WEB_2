import { Link, useParams } from "react-router-dom";
import "./reviewPage.scss";
import { useEffect, useState } from "react";
import axios from "axios";

function ReviewPage() {
  const { id } = useParams();
  const [hotel, setHotel] = useState<[]>([]);
  const [review, setReview] = useState<[]>([]);
  const [user, setUser] = useState<[]>([]);
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/hotel/get-hotel-by-id", {
        params: {
          HotelID: id,
        },
      })
      .then((res) => {
        setHotel(res.data);
      });

    axios.get("http://localhost:8080/api/review/get-review").then((res) => {
      setReview(res.data);
    });

    axios.get("http://localhost:8080/api/user/get-user").then((res) => {
      setUser(res.data);
    });
  }, [id]);

  const filteredReview = (hotelID: number) => {
    return review.filter((res: any) => res.HotelID === hotelID);
  };

  const filteredUser = (userID: number) => {
    const name = user.filter((res: any) => res.UserID === userID);
    return name.map((res: any) => res.FirstName + " " + res.LastName);
  };

  function formatDate(dateTimeString: string): string {
    const options = {
      year: "numeric" as const,
      month: "short" as const,
      day: "numeric" as const,
    };

    const formattedDate = new Date(dateTimeString).toLocaleString(
      "en-US",
      options
    );
    return formattedDate;
  }

  console.log(review);

  return (
    <div className="outer-manage-hotel-container">
      {hotel.map((res: any, index: number) => (
        <h1 key={index} className="text-h1">
          {res.HotelName} Review
        </h1>
      ))}
      <div className="middle-manage-hotel-container">
        <div className="review-container">
          <div className="picture-container">
            {hotel.map((res: any, index: number) => (
              <div key={index}>
                <img width={500} height={300} src={res.HotelPicture[0]} />
                <div className="gap-2 flex">
                  <img height={130} width={245} src={res.HotelPicture[1]} />
                  <img height={130} width={247} src={res.HotelPicture[2]} />
                </div>
                <div className="flex justify-center">
                  <Link to={"/hotel-page"}>
                    <button className="view-room-button mt-2">Back</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="inner-review-content">
            {filteredReview(parseInt(id!)).map((res: any, index: number) => (
              <div key={index} className="inner-review-card">
                <div className="review-detail-container">
                  <h1>{formatDate(res.ReviewDate)}</h1>
                  {res.UserID !== 0 ? (
                    <h1>{filteredUser(res.UserID)}</h1>
                  ) : (
                    <h1>Anonymous</h1>
                  )}
                </div>
                <h1 className="ml-3 mt-2">{res.ReviewContent}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
