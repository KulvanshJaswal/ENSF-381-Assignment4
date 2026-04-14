import { useEffect, useState } from "react";
import "../StyleSheet.css";

function MainSection (){
    const [featuredFlavors, setFeaturedFlavors] = useState([])
    useEffect(()=>{
        fetch("http://localhost:5000/flavors")
            .then(res => res.json())
            .then(data => {
                const shuffled = data.flavors.sort(() => Math.random() - 0.5);
                const picked = shuffled.slice(0, 3);
                setFeaturedFlavors(picked);
            });
    },[]);

    const [custReviews, setReviews] = useState([])
    useEffect(() =>{
        fetch("http://localhost:5000/reviews")
            .then(res => res.json())
            .then(data => {
                setReviews(data.reviews);
            });
    },[]);

    return(
        <div className="main-section">
            <div>
                <h2>About Sweet Ice Cream Shop</h2>
                <p>
                    Sweet Scoop Ice Cream is a family-owned business that has been serving delicious ice cream since 1990. 
                    We pride ourselves on using only the freshest ingredients to create our unique flavors. 
                    Whether you're in the mood for a classic vanilla or something more adventurous like our signature "Chocolate Explosion," we have something for everyone. 
                    Come visit us and treat yourself to a sweet scoop today!
                </p>
            </div>
            <h2>Featured Flavors</h2>
            <div className="flavor-grid">
                {featuredFlavors.map((flavor) => (
                    <div key={flavor.id} className="flavor-card">
                        <p>{flavor.name}</p>
                        <p>{flavor.description}</p>
                        <p>{flavor.price}</p>
                        <img src={flavor.image}></img>
                    </div>
                ))}
            </div>
            <div>
                <h2>Customer Reviews</h2>
                {custReviews.map((review) => (
                    <div key={review.customerName}>
                        <p>{review.customerName}</p>
                        <p>{review.review}</p>
                        <p>{"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainSection;