export const getProperties =  `
query MyQuery {
    listProperties {
      nextToken
      items {
        id
        userSub
        title
        image
        images
        description
        type
        address
        video
        perks
        amenities
        views
        verified
        published
        area
        contactNumber
        contactEmail
        priceType
        oldPrice
        newPrice
        latitude
        longitude
        createdAt
        updatedAt
      }
    }
  }  
    `
