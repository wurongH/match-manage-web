<template>
    <div ref="pdf" class="pdf-container" id="pdf">
        <canvas id="pdf-canvas"></canvas>
    </div>
</template>
<script>
    import PDFJS  from "pdfjs-dist";

    export default {
        name: "pdf",
        props: {
            source: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                pdfDoc: null,
                pageRendering: false,
                scale: 1,
            }
        },
        mounted(){
            this.generatePdf(this.source);
        },
        methods: {
            generatePdf(url){
                let _this = this
                PDFJS.getDocument(url).then((pdf) => {
                    _this.pdfDoc = pdf;
                    _this.renderPage(1);
                });
            },
            renderPage (num) {
                debugger
                this.pageRendering = true
                let _this = this
                this.pdfDoc.getPage(num).then(function (page) {

                    var viewport = page.getViewport(_this.scale)
                    let canvas = document.getElementById('pdf-canvas')
                    canvas.height = viewport.height
                    canvas.width = viewport.width

                    // Render PDF page into canvas context
                    var renderContext = {
                        canvasContext: canvas.getContext('2d'),
                        viewport: viewport
                    }
                    var renderTask = page.render(renderContext)

                    // Wait for rendering to finish
                    renderTask.promise.then(function () {
                        _this.pageRendering = false
                        if (_this.pageNumPending !== null) {
                            // New page rendering is pending
                            this.renderPage(_this.pageNumPending)
                            _this.pageNumPending = null
                        }
                    })
                })
            },
        },
    }
</script>
<style lang="less" scoped>
    #pdf{
        height:300px;
        width: 500px;
    }
</style>