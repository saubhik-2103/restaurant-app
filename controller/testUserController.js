export const testUserController = (req, res) => {
    try {
       res
       .status(200)
       .json({
           success: true,
           message: "Test User data API"
       })
    } catch (error) {
        console.log(error);
    }
}