export const getProperties =  `
query MyQuery {
    listProperties {
      nextToken
      startedAt
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
        rating
        ratings
        contactNumber
        contactEmail
        priceType
        oldPrice
        newPrice
        latitude
        longitude
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
    }
  }  
    `
