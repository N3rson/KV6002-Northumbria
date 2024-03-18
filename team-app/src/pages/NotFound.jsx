
/**
 * NotFound Page
 * 
 * This page is responsible for displaying a 404 error message when a user tries to access a page that doesn't exist.
 * 
 * @category Page
 * @author Karol Fryc
*/

function NotFound() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <h1>404 Not Found</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
      </div>
    )
  }
  
export default NotFound