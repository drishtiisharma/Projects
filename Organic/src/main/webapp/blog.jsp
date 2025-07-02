<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <!DOCTYPE html>
<html lang="en">
<head>
<title>
Organic Grocery Store
</title>

    <title>Organic Grocery Store</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="author" content="">
    <meta name="keywords" content="">
    <meta name="description" content="">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="css/vendor.css">
    <link rel="stylesheet" type="text/css" href="style.css">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">

  </head>   
            
  <body>

    <%@include file="header.jsp" %>
  
 <section id="latest-blog" class="pb-4">
      <div class="container-lg">
        <div class="row">
          <div class="section-header d-flex align-items-center justify-content-between my-4">
            <h2 class="section-title">Our Recent Blog</h2>
            <a href="#" class="btn btn-primary">View All</a>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <article class="post-item card border-0 shadow-sm p-3">
              <div class="image-holder zoom-effect">
                <a href="#">
                  <img src="images/post-thumbnail-1.jpg" alt="post" class="card-img-top">
                </a>
              </div>
              <div class="card-body">
                <div class="post-meta d-flex text-uppercase gap-3 my-2 align-items-center">
                  <div class="meta-date"><svg width="16" height="16"><use xlink:href="#calendar"></use></svg>22 Aug 2021</div>
                  <div class="meta-categories"><svg width="16" height="16"><use xlink:href="#category"></use></svg>tips & tricks</div>
                </div>
                <div class="post-header">
                  <h3 class="post-title">
                    <a href="#" class="text-decoration-none">Top 10 casual look ideas to dress up your kids</a>
                  </h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam. A in arcu, hendrerit neque dolor morbi...</p>
                </div>
              </div>
            </article>
          </div>
          <div class="col-md-4">
            <article class="post-item card border-0 shadow-sm p-3">
              <div class="image-holder zoom-effect">
                <a href="#">
                  <img src="images/post-thumbnail-2.jpg" alt="post" class="card-img-top">
                </a>
              </div>
              <div class="card-body">
                <div class="post-meta d-flex text-uppercase gap-3 my-2 align-items-center">
                  <div class="meta-date"><svg width="16" height="16"><use xlink:href="#calendar"></use></svg>25 Aug 2021</div>
                  <div class="meta-categories"><svg width="16" height="16"><use xlink:href="#category"></use></svg>trending</div>
                </div>
                <div class="post-header">
                  <h3 class="post-title">
                    <a href="#" class="text-decoration-none">Latest trends of wearing street wears supremely</a>
                  </h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam. A in arcu, hendrerit neque dolor morbi...</p>
                </div>
              </div>
            </article>
          </div>
          <div class="col-md-4">
            <article class="post-item card border-0 shadow-sm p-3">
              <div class="image-holder zoom-effect">
                <a href="#">
                  <img src="images/post-thumbnail-3.jpg" alt="post" class="card-img-top">
                </a>
              </div>
              <div class="card-body">
                <div class="post-meta d-flex text-uppercase gap-3 my-2 align-items-center">
                  <div class="meta-date"><svg width="16" height="16"><use xlink:href="#calendar"></use></svg>28 Aug 2021</div>
                  <div class="meta-categories"><svg width="16" height="16"><use xlink:href="#category"></use></svg>inspiration</div>
                </div>
                <div class="post-header">
                  <h3 class="post-title">
                    <a href="#" class="text-decoration-none">10 Different Types of comfortable clothes ideas for women</a>
                  </h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam. A in arcu, hendrerit neque dolor morbi...</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
    </body>
    
        <%@ include file="footer.jsp" %>
    </html>
        