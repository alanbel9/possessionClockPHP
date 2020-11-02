<?php require_once("html/base_top.php"); ?>

    <main role="main" class="inner cover">
        <h1 class="cover-heading title">CONTACTO</h1>

        <div class="container">
            <form method="get" action="../controllers/ContactController.php">
                <div class="form-group row">
                    <label for="formGroupExampleInput" class="col-sm-2 col-form-label">Nombre</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="formGroupExampleInput">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="formGroupExampleInput" class="col-sm-2 col-form-label">Apellido</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="formGroupExampleInput">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="inputEmail3" class="col-sm-2 col-form-label">Correo</label>
                    <div class="col-sm-10">
                        <input type="email" class="form-control" id="inputEmail3" placeholder="example@example.com">
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-sm-2">Mensaje</div>
                    <div class="col-sm-10">
                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-sm-10">
                        <button type="submit" class="btn btn-primary">Enviar</button>
                    </div>
                </div>
            </form>
        </div>
    </main>

<?php require_once("html/base_bottom.php"); ?>