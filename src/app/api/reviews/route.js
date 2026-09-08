import { connectDB } from "@/db/connectDB";
import Review from "@/models/ReviewModel";
import { NextResponse } from "next/server";

// create a review
export const POST = async (request) => {
    const review = await request.json();
    if (!review.text) {
        return new NextResponse("Please enter all fields", {status: 422})
    }
    // TO DO Add logic to prevent users from reviewing their properties
    await connectDB();    
    try {
        const newReview = new Review({
            ...review
        });  
        const savedReview = await newReview.save();      
        return NextResponse.json(
            { message: 'Review created successfully', 
              success: true,
              review: savedReview
            },
            { status: 201 }
        )
    } catch (error) {
        return new NextResponse(error.message, {status: 500})
    }
}

// get all reviews
export const GET = async (request) => {
    // get review id
    const params = new URLSearchParams(request.url.split('?')[1]);
    const id = params.get("id")
    await connectDB();
    try {
        // check if user already exists using email to avoid duplicates
        if (id){
            console.log("ID: ", id)
            const reviews = await Review.find({property: id});
            if (!reviews.length) {
                return new NextResponse(`Reviews of property id:${id} not found`, {status: 404})
            }
            return NextResponse.json(
                { success: true, 
                  reviews
                },
                {status: 200}
            )
        }
        const reviews = await Review.find();

        return NextResponse.json(
            { success: true, 
              reviews
            },
            {status: 200}
        )
    } catch (error) {
        return new NextResponse(error.message, {status: 500,})
    }
}

// update review details
export const PUT = async (request) => {
    const body = await request.json();
    const {_id, updatedReview} = body;
    try {
      await Review.findOneAndUpdate({_id},{...updatedReview});
      const review = await Review.find({_id})
      return NextResponse.json(
        { message: 'Review updated successfully', 
          success: true, 
          review
        }, 
        { status: 200 }
      );
    } catch (error) {
      console.log('Review Updating error!');
      return new NextResponse(error.message, {status: 422});
    }
}

// delete a Review
export const DELETE = async (request) => {
    const params = new URLSearchParams(request.url.split('?')[1]);
    const id = params.get("id")
    await connectDB();
    try {
        // perfoem delete action
        const review = await Review.findOneAndDelete({_id: id});
        if (!review) {
            return new NextResponse("Review not found", {status: 404})
        }
        return new NextResponse("Review deleted successfully", {status: 200})
    } catch (error) {
        return new NextResponse(error.message, {status: 500, })
    }
}