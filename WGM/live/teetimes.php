<!DOCTYPE HTML>
<html>
<?php
	$host_name = 'db721809567.db.1and1.com';
	$database = 'db721809567';
	$user_name = 'dbo721809567';
	$password = '';
	$connect = mysqli_connect($host_name, $user_name, $password, $database);

	if (mysqli_connect_errno()) {
		echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
	} 



/* 	function submitInfo()
	{
		echo "hello world";
		$day = $_POST['hidden_day'];
		$section = $_POST['hidden_section'];
		$name = $_Post['name'];
		$email = $_Post['email'];
		if($connect->query("Insert into entries (day, section, name, email) values  (" . $day . ", " . $section .", " . $name . ", " . $email . ")") == TRUE)
		{
			echo "added";
		}else{
			echo "error: " .$connect->error;
		}
		
		
	} */
	?>
	<head>
		<title>TeeTimes</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
		<link rel="stylesheet" href="assets/css/main.css" />
		<!--[if lte IE 9]><link rel="stylesheet" href="assets/css/ie9.css" /><![endif]-->
	</head>
	<div id="signUpModal" class="signUpModal" >	
	<div class = "form animate">
	<form method="post" action="submit.php">
		<div class="signUpHeader">
		Lock In Your Tee Time
		<br/>
		<br/>
		</div>
	<input type="hidden" id="hidden_day" name = "hidden_day" value="0"/>
	<input type="hidden" id="hidden_section" name = "hidden_section" value="0"/>
	<input type ="text" id="name" name = "name" placeholder="name"/>
	<br/>
	<br/>
	<input type ="text" id="email" name = "email" placeholder="email"/>
	<br/>
	<br/>
	<!-- <input type="submit" value = "Submit" name ="submit" class="submitButton" /> -->
	<button type="submit" value="Submit" name="submit" class="submitButton" >Submit</button>
	<br/>
	<br/>
	<!-- <input type="button" value = "Cancel" name = "cancel" class="submitButton"/> -->
	<a href="#"><button type="button" class = "cancelButton" onClick="document.getElementById('signUpModal').style.display='none';document.getElementById('name').value = '';document.getElementById('email').value=''">Cancel</button></a>
	</form>
	</div>
		<?php
           if(isset($_POST['submit']))
           {
			   submitInfo();
			   
           } 
        ?>
	
</div>
	<body class="subpage">
		<div id="page-wrapper">

			<!-- Header -->
				<div id="header-wrapper">
					<header id="header" class="container">
						<div class="row">
							<div class="12u">

								<!-- Logo -->
								<h1><a href="index.html" id="logo"><img src="images/wgm_small.png" style="vertical-align:center"/></a></h1>

								<!-- Nav -->
									<nav id="nav">
									<a href="index.html">Home</a>
									<a href="teetimes.php">TeeTimes</a>
									</nav>

							</div>
						</div>
					</header>
				</div>
				
			<!-- Content -->




			<div id="content-wrapper">
					<div id="content">
					<div class="container">
							<div class="row">
							<div class="4u 12u(mobile)">

									<!-- Box #1 -->
										<section>
											<header>
												<h2>April 3 - Practice Day 1</h2>
												<h3> 7:00 p.m. - Featured Group</h3>
											</header>
											<ul class="quote-list">
											<?php
											
											$res = $connect->query("Select * from teetimes where day = 1 and section = 1");
											$res->data_seek(0);
											$count = 1;
											while ($row = $res->fetch_assoc()) 
											{
												echo "<li> $row[formName] </li>";
												$count++;
											}
											
											while ($count <= 4)
											{
												echo "<li>
												<a href=\"#signUpModal\" name=\"signUpButton\" class=\"button-small\" data-toggle=\"modal\" data-target=\"#signUpModal\"  data-section=\"1\" data-day=\"1\" style=\"color: #fff\" onclick=\"document.getElementById('signUpModal').style.display='flex'\">Sign Up</a>												    &nbspSpot #" .$count ."
													<span></span>
												</li>";
												$count++;
											}
											?>
												
											</ul>
										</section>

								</div>
								<div class="4u 12u(mobile)">

									<!-- Box #2 -->
										<section>
											<header>
												<h2>April 4 - Practice Day 2</h2>
												
												<h3> 7:00 p.m. - Featured Group</h3>
											</header>
											<ul class="quote-list">
											<?php
											
											$res = $connect->query("Select * from teetimes where day = 2 and section = 1");
											$res->data_seek(0);
											$count = 1;
											while ($row = $res->fetch_assoc()) 
											{
												echo "<li> $row[formName] </li>";
												$count++;
											}
											
											while ($count <= 4)
											{
												echo "<li>
												<a href=\"#signUpModal\" name=\"signUpButton\" class=\"button-small\" data-toggle=\"modal\" data-target=\"#signUpModal\"  data-section=\"1\" data-day=\"2\" style=\"color: #fff\" onclick=\"document.getElementById('signUpModal').style.display='flex'\">Sign Up</a>												    &nbspSpot #" .$count ."
													<span></span>
												</li>";
												$count++;
											}
											?>
											</ul>
										</section>

								</div>
								<div class="4u 12u(mobile)">

									<!-- Box #3 -->
										<section>
											<header>
												<h2>April 5 - 1v1 Tournament</h2>
												
												<h3> 7:00 p.m. - Featured Group</h3>
												<h3> $10 Entry Fee - Winner Take All</h3>
											</header>
											<ul class="quote-list">
											<?php
											
											$res = $connect->query("Select * from teetimes where day = 3 and section = 1");
											$res->data_seek(0);
											$count = 1;
											while ($row = $res->fetch_assoc()) 
											{
												echo "<li> $row[formName] </li>";
												$count++;
											}
											
											while ($count <= 4)
											{
												echo "<li>
												<a href=\"#signUpModal\" name=\"signUpButton\" class=\"button-small\" data-toggle=\"modal\" data-target=\"#signUpModal\"  data-section=\"1\" data-day=\"3\" style=\"color: #fff\" onclick=\"document.getElementById('signUpModal').style.display='flex'\">Sign Up</a>												    &nbspSpot #" .$count ."
													<span></span>
												</li>";
												$count++;
											}
											?>
											</ul>
										</section>

								</div>
								<div class="4u 12u(mobile)">

									<!-- Box #4 -->
										<section>
											<header>
												<h2>April 6 - Tournament Day 1</h2>
												
												<h3> 7:00 p.m. - Featured Group</h3>
												<h3> $20 Entry Fee - Winner 80% + Prestigous Green Jacket</h3>
											</header>
											<ul class="quote-list">
											<?php
											
											$res = $connect->query("Select * from teetimes where day = 4 and section = 1");
											$res->data_seek(0);
											$count = 1;
											while ($row = $res->fetch_assoc()) 
											{
												echo "<li> $row[formName] </li>";
												$count++;
											}
											
											while ($count <= 4)
											{
												echo "<li>
												<a href=\"#signUpModal\" name=\"signUpButton\" class=\"button-small\" data-toggle=\"modal\" data-target=\"#signUpModal\"  data-section=\"1\" data-day=\"4\" style=\"color: #fff\" onclick=\"document.getElementById('signUpModal').style.display='flex'\">Sign Up</a>												    &nbspSpot #" .$count ."
													<span></span>
												</li>";
												$count++;
											}
											?>
											</ul>
										</section>

								</div>
								<div class="4u 12u(mobile)">

									<!-- Box #5 -->
										<section>
											<header>
												<h2>April 6 - Tournament Day 1</h2>
												
												<h3> 11:00 p.m. - Second Group</h3>
											</header>
											<ul class="quote-list">
											<?php
											
											$res = $connect->query("Select * from teetimes where day = 4 and section = 2");
											$res->data_seek(0);
											$count = 1;
											while ($row = $res->fetch_assoc()) 
											{
												echo "<li> $row[formName] </li>";
												$count++;
											}
											
											while ($count <= 4)
											{
												echo "<li>
												<a href=\"#signUpModal\" name=\"signUpButton\" class=\"button-small\" data-toggle=\"modal\" data-target=\"#signUpModal\"  data-section=\"2\" data-day=\"4\" style=\"color: #fff\" onclick=\"document.getElementById('signUpModal').style.display='flex'\">Sign Up</a>												    &nbspSpot #" .$count ."
													<span></span>
												</li>";
												$count++;
											}
											?>
											</ul>
										</section>

								</div>
								
								
							</div>
						</div>
					</div>
				</div>

			<!-- Footer -->
				<div id="footer-wrapper">
					<footer id="footer" class="container">
						<div class="row">
							
							
						</div>
					</footer>
				</div>

			<!-- Copyright -->
				<div id="copyright">
					&copy; Speegle National Country Club | All rights reserved. | Design: <a href="http://html5up.net">HTML5 UP</a>
				</div>

		</div>

		<!-- Scripts -->
			<script src="assets/js/jquery.min.js"></script>
			<script src="assets/js/skel.min.js"></script>
			<script src="assets/js/skel-viewport.min.js"></script>
			<script src="assets/js/util.js"></script>
			<!--[if lte IE 8]><script src="assets/js/ie/respond.min.js"></script><![endif]-->
			<script src="assets/js/main.js"></script>
			<script type='text/javascript'>
			var buttons = document.getElementsByName('signUpButton');
			var dayNo = document.getElementById('hidden_day');
			var sectionNo = document.getElementById('hidden_section');
			buttons.forEach(function(element) {
			element.addEventListener('click', function() {
			sectionNo.value = this.getAttribute('data-section');
			dayNo.value = this.getAttribute('data-day');
			}, true)
			});
			</script>

	</body>
</html>