const blocks = {
	
	init : function(p){},
	
	collections :{ 
		paragraph : {
			markup : {
				styles    	: {"default":['paragraph','container','p']},
				collection  : {'paragraph':'<div class="paragraph"></div>'},
				containers  : {'container':'<div class="container"></div>'},
				blocks      : {'p':'<p><span><br></span></p>'}
			},
			triggers : {13:{p:1},8:{p:1}},
			selector : {'p':true}
		},
		heading : {

			markup : {
				styles    	: {"default":['heading','container','h3']},
				collection  : {'heading':'<div class="heading"></div>'},
				containers  : {'container':'<div class="container"></div>'},
				blocks      : {'h3':'<h3><span>Sample Heading</span></h3>'}
			},
			selector : {'div':true}
		},
		quote : {
			markup : {
				styles    	: {"default":['quote','container','blockquote']},
				collection  : {'quote':'<div class="quote"></div>'},
				containers  : {'container':'<div class="container"></div>'},
				blocks      : {'blockquote':'<blockquote><span>If you don\'t know where your going, any road will get you there.</span><cite>Jane Doe, Mrs Insightful</cite></blockquote>'}
			},
		},		

		note : {
			markup : {
				styles    	: {"default":['note','container','note']},
				collection  : {'note':'<div class="note"></div>'},
				containers  : {'container':'<div class="container"></div>'},
				blocks      : {'note':'<div class="item"><h5 class="item-heading">Note:</h5><div class="item-txt">This information is important to you.</div></div>'}
			},
		},			

		image : {
			markup : {
				styles    	: {"default":['image','container','upload'],
							   "basic":['image','container','basic']},
				collection  : {'image':'<div class="image" contenteditable="false"></div>'},
				containers  : {'container':'<div class="container"></div>'},
				blocks      : {
								'upload':'<div class="upload" contenteditable="false"><div class="upload-item"><img class="upload-item-img" src="https://rumcore.github.io/writable.ai/assets/icons/svg/black/selector-image.svg"/><span>Drag & Drop image or </span><a class="upload-item-link">click here </a><span>to add image URL.</span></div></div>',
								'basic' : '<div class="basic"><img class="basic-img"/></div>'
							  }
			},
			actions : {
				init : function(r,p){
					var items      = p[0].getElementsByClassName("image");
					var collection = p[1];
					for(var i=0;i<items.length;i++){
						collection.actions.set.uploader(r,[items[i]]);
					}
				},
				set : {
					uploader : function(r,p){
						var collection = p[0];
						var container = collection.firstElementChild;
						container.addEventListener("click",function(p){
							var params    = {title:'Add Image URL'};
							params.styles = {padding:"24px",width:"360px"}
							params.inputs = [["textarea",{id:'img-url',rows:4}]]
							params.options = {}
							params.options.done = function(r){
								var src = document.getElementById("img-url").value;
								var e = document.createElement('div');
								e.innerHTML = r.collections["image"].markup.blocks["basic"];
								var img = e.firstElementChild;
								img.firstElementChild.src = src;
								container.replaceChild(img,container.firstElementChild);
								r.dialog.hide(r);
							}
							r.dialog.show(r,[params]);
						});
						container.addEventListener("dragover",function(p){},false);
						container.addEventListener("drop",function(p){
						r.api.set.image.upload(r,function(p){
							var src    = p[0];
							var srcset = p[1];
							var e = document.createElement('div');
							e.innerHTML = r.collections["image"].markup.blocks["basic"];
							var img = e.firstElementChild;
							img.firstElementChild.src = src;
							img.srcset = srcset;
							container.replaceChild(img,container.firstElementChild);
						});
					},false);

					}
				}
			}
		}
	}
}