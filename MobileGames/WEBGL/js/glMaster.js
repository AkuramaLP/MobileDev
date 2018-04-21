
function GlMaster(canvasId) {
    
    var thiz = this;

    var canvas = null;
    var gl = null;

    var triangleShaderProg = null;
    var fragementShader = null;
    var vertextShader = null;

    var triangleBuffer = null;

    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();

    var vertices = [
        0.0,  1.0,  0.0,
       -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0
   ];

    var webGlConfig = {
        antialias: true,
        depth: true
    };

    thiz.draw = function(isLeftPressed, isRightPressed) {
        if(gl) {
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            mat4.perspective(45.0, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
            mat4.identity(mvMatrix);

            mat4.translate(mvMatrix, [0.0, 0.0, -4.0]);

            gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
            gl.vertexAttribPointer(triangleShaderProg.positionLocation, triangleBuffer.itemSize, gl.FLOAT,false, 0, 0);

            gl.uniformMatrix4fv(triangleShaderProg.PerspLocation, false, pMatrix);
            gl.uniformMatrix4fv(triangleShaderProg.ModelViewLocation, false, mvMatrix);

            gl.drawArrays(gl.TRIANGLES, 0, triangleBuffer.numItems);
        }
    }

    function compileShaders() {
        if(gl) {
            var str = '';
            var k = document.getElementById('vertexShader').firstChild;
            while (k) {
                if (k.nodeType == 3)
                    str += k.textContent;
                k = k.nextSibling;
            }
            var vertexSource = str;

            str = '';
            k = document.getElementById('fShader').firstChild;
            while (k) {
                if (k.nodeType == 3)
                    str += k.textContent;
                k = k.nextSibling;
            }
            var fragmentSource = str;

            vertextShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertextShader, vertexSource);
            gl.compileShader(vertextShader);

            if (!gl.getShaderParameter(vertextShader, gl.COMPILE_STATUS)) {
                alert(gl.getShaderInfoLog(vertextShader));
            }

            fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, fragmentSource);
            gl.compileShader(fragmentShader);
            
            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                alert(gl.getShaderInfoLog(fragmentShader));
            }

            triangleShaderProg = gl.createProgram();
            gl.attachShader(triangleShaderProg, vertextShader);
            gl.attachShader(triangleShaderProg, fragmentShader);
            gl.linkProgram(triangleShaderProg);

            if (!gl.getProgramParameter(triangleShaderProg, gl.LINK_STATUS)) {
                alert("Could not initialise shaders");
            }          

            gl.useProgram(triangleShaderProg);

            triangleShaderProg.positionLocation = gl.getAttribLocation(triangleShaderProg, 'Position');
            gl.enableVertexAttribArray(triangleShaderProg.positionLocation);

            triangleShaderProg.PerspLocation = gl.getUniformLocation(triangleShaderProg, 'u_Persp');
            triangleShaderProg.ModelViewLocation = gl.getUniformLocation(triangleShaderProg, 'u_ModelView');            

        }
    }

    function init() {
        canvas = document.getElementById(canvasId);
        
        if(canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            try {
                gl = canvas.getContext('webgl', webGlConfig) ||
                     canvas.getContext('experimental-webgl', webGlConfig);

                gl.viewportWidth = canvas.width;
                gl.viewportHeight = canvas.height;

                compileShaders();

                console.log(gl);

                triangleBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
                triangleBuffer.itemSize = 3;
                triangleBuffer.numItems = 3;

                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.enable(gl.DEPTH_TEST);
            }
            catch(e) {
                console.log(e);
            }

        }
    }

    init();
}