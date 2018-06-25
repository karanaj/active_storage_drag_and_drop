import { start } from "./ujs"

export { start }

function autostart() {
  start()
}

setTimeout(autostart, 1)

//----------------------------------------------------------------------------------------------------
// UI Events - this code is completely outside the draganddrop lib - it's just reacting to events
//----------------------------------------------------------------------------------------------------
var fileUploadUIPainter = function(iconContainer, id, filename, complete) {
  // the only rule here is that all root level elements must have the data: { direct_upload_id: [id] } attribute ala: 'data-direct-upload-id="${id}"'
  var cname = ( complete ? 'complete' : 'pending' )
  var progress = ( complete ? 100 : 0 )
  iconContainer.insertAdjacentHTML("beforeend", `
    <div id="direct-upload-${id}" class="direct-upload direct-upload--${cname}" data-direct-upload-id="${id}">
      <div id="direct-upload-progress-${id}" class="direct-upload__progress" style="width: ${progress}%"></div>
      <span class="direct-upload__filename">${filename}</span>
    </div>
    <a href='remove' class='direct-upload__remove' data-dnd-delete='true' data-direct-upload-id="${id}">x</a>
  `)
}

addEventListener("dnd-uploads:start", event => {
  console.log("dnd-uploads:start")
})
addEventListener("dnd-uploads:end", event => {
  console.log("dnd-uploads:end")
})

addEventListener("dnd-upload:initialize", event => {
  console.log("dnd-upload:initialize")
  const { target, detail } = event
  const { id, file, iconContainer } = detail
  fileUploadUIPainter(iconContainer, id, file.name, false)
})

addEventListener("dnd-upload:placeholder", event => {
  console.log("dnd-upload:placeholder")
  const { target, detail } = event
  const { id, fileName, iconContainer } = detail
  fileUploadUIPainter(iconContainer, id, fileName, true)
})

addEventListener("dnd-upload:start", event => {
  console.log("dnd-upload:start")
  const { id } = event.detail
  const element = document.getElementById(`direct-upload-${id}`)
  element.classList.remove("direct-upload--pending")
})

addEventListener("dnd-upload:progress", event => {
  console.log("dnd-upload:progress")
  const { id, progress } = event.detail
  const progressElement = document.getElementById(`direct-upload-progress-${id}`)
  progressElement.style.width = `${progress}%`
})

addEventListener("dnd-upload:error", event => {
  console.log("dnd-upload:error")
  event.preventDefault()
  const { id, error } = event.detail
  const element = document.getElementById(`direct-upload-${id}`)
  element.classList.add("direct-upload--error")
  element.setAttribute("title", error)
})

addEventListener("dnd-upload:end", event => {
  console.log("dnd-upload:end")
  const { id } = event.detail
  const element = document.getElementById(`direct-upload-${id}`)
  element.classList.remove("direct-upload--pending")
  element.classList.add("direct-upload--complete")
})
