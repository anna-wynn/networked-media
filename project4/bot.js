// import the .env file so that we can keep our password outside of our script
require("dotenv").config()

// importing the masto library to interface with our mastodon server
const m = require("masto")

const masto = m.createRestAPIClient({
    url: "https://networked-media.itp.io/",
    accessToken: process.env.token,
})

const stream = m.createStreamingAPIClient({
    accessToken: process.env.token,
    streamingApiUrl: "wss://networked-media.itp.io", 
});

async function makeStatus(text){
    const status = await masto.v1.statuses.create({
        status: text,
        visibility: "public"

    })

async function reply() {
    const notificationSubscription = await stream.user.notification.subscribe();

    for await (let notif of notificationSubscription) {

        let type = notif.payload.type;
        let acct = notif.payload.account.acct;
        let replyId = notif.payload.status.id;

        if (notif.payload.type == "mention") {
            
            const status = await masto.v1.statuses.create({
                status: `@${acct} 👁️🐽👁️!`,
                visibility: "public",
                in_reply_to_id: replyId,
            });
        }
    }
}

reply ()

    console.log(status.url)
}

function multipleStatuses(){
    
    // if you want to make an external express, do it here
    let things = ["!Pocky (Japan): Thin, crunchy biscuit sticks coated with a layer of chocolate, strawberry, or matcha. A classic treat that's easy to snack on and great for sharing!🍫",
        "!Chips Ahoy! (USA): These chocolate chip cookies are a blend of crispy and chewy, with chunks of chocolate in every bite. Perfect with a glass of milk!🍪",
        "!Paprika Pringles (Europe): A twist on the traditional Pringles, these are coated with a paprika spice that adds a savory kick to the crispy potato chips!🌶️",
        "!Choco Pie (South Korea): Soft marshmallow sandwiched between two sponge cakes, all covered in chocolate. A satisfying mix of fluffy and chocolaty goodness!🍫",
        "!Tim Tam (Australia): Chocolate biscuits filled with chocolate cream, then coated in even more chocolate. Perfect for a Tim Tam Slam with your favorite hot drink!🍵",
        "!Takis (Mexico): Rolled tortilla chips with an intense lime and chili flavor. Crunchy, tangy, and spicy — a true thrill for snack lovers!🌶️",
        "!Smarties (UK): Colorful candy-coated chocolates that bring a burst of sweetness and fun. Each piece is a tiny taste of joy!🍬",
        "!Bamba (Israel): Peanut butter-flavored puffs that melt in your mouth. Light, airy, and just the right amount of nutty!🫚",
        "!Haw Flakes (China): Thin, round discs made from the hawthorn fruit. Sweet, slightly tangy, and traditionally enjoyed as a unique Asian treat!🍒",
        "!Shrimp Chips (Thailand): Light and crunchy chips with a hint of shrimp flavor. Perfect for seafood fans looking for a savory snack!🍤"

]

    let rand = Math.floor(Math.random()*things.length)

    let mention = "@ChelseaLjx7";
    let post = `${mention} ${things[rand]}`; 

    makeStatus(post)
}
setInterval(multipleStatuses, 3600000)

// makeStatus("hello my first status!")
