<?php
	$host_name = 'db721809567.db.1and1.com';
	$database = 'db721809567';
	$user_name = 'dbo721809567';
	$password = '';
	$connect = mysqli_connect($host_name, $user_name, $password, $database);

	if (mysqli_connect_errno()) {
		echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    }


		$day = $_POST['hidden_day'];
		$section = $_POST['hidden_section'];
		$name = $_POST['name'];
        $email = $_POST['email'];
        $q = "Insert into teetimes (day, section, formName, email) values  ($day, $section, '$name', '$email')";
        if(mysqli_query($connect, $q) == TRUE)
		{
			echo "added";
		}else{
			echo "error: " . $q . " ::: " .$connect->error;
		}
       
		
	
    ?>
    
    <script>
window.location = 'http://test.wiigolfmasters.com/teetimes.php';
</script>