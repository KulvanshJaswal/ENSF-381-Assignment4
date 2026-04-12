import React, {useState, useEffect} from "react";

function MainSection(){

const [randomFlavors,setRandomFlavors] = useState([]);
const [randomReviews,setRandomReviews] = useState([]);

useEffect(() => {
fetch("http://localhost:5000/flavors")
.then(res => res.json())
.then(data => {
const shuffled = [...data.flavors].sort(() => 0.5 - Math.random());
setRandomFlavors(shuffled.slice(0, 3));
});

fetch("http://localhost:5000/reviews")
.then(res => res.json())
.then(data => {
setRandomReviews(data.reviews);
});
}, []);

return(

<div className="main-section">

<h2>About Sweet Scoop</h2>
<p className="about-text">
Sweet Scoop offers a variety of delicious ice cream flavors made from fresh ingredients.
</p>

<h2>Featured Flavors</h2>

<div className="featured-flavors">

{randomFlavors.map(f=>(
<div className="flavor-card" key={f.id}>
<h4>{f.name}</h4>
<p>{f.price}</p>
</div>
))}

</div>

<h2>Customer Reviews</h2>

<div className="reviews">

{randomReviews.map((r,i)=>(
<div  key={i}>
<h4>{r.customerName}</h4>
<p>{r.review}</p>
<p>{"★".repeat(r.rating)}</p>
</div>
))}

</div>

</div>

)

}

export default MainSection;