var $ = W.$J;

function inventoryPageInit(){
	// for subid detect
	var ajaxTarget = {descriptions:[]};

	W.getSubid = function(target, itemid){
		ajaxTarget.element = target;

		var item = W.UserYou.rgContexts[753][1].inventory.rgInventory[itemid];

		ajaxTarget.classid = item.classid;
		ajaxTarget.giftId = itemid;
		ajaxTarget.giftName = encodeURIComponent(item.name);

		new W.Ajax.Request( 'http://steamcommunity.com/gifts/' + ajaxTarget.giftId + '/validateunpack', {
			method: 'post',
			parameters: { sessionid: W.g_sessionID },
			onSuccess: function( transport ) {
				W.setSubID(transport.responseJSON.packageid);
			}
		});
	}

	W.setSubID=function(subid){
		var str = 'SubscriptionID = <a href="http://steamdb.info/sub/'+subid+'">'+subid+'</a>';
		ajaxTarget.element.outerHTML=str;
		var ds = ajaxTarget.descriptions[ajaxTarget.classid];
		ds[ds.length-1]={value:str};
		ds.withSubid=true;
	}


	// styles
	document.body.insertAdjacentHTML("afterBegin",
		'<style>.checkedForSend{background:#366836!important}.itemcount{background:#292929;color:#FFF;font-weight:700;position:absolute;right:0;bottom:0}.swt_icon{position:absolute;top:0;left:0}.swt_icon-st{background:#CF6A32;color:#fff}.swt_icon-t{background:#FDEC14;color:#000}#inventory_logos{display:none}.swt_hidden{display:none}</style>'
	);

	// multi gifts sending
	W.checkedForSend={};
	W.checkForSend = function(giftId){
		var item = W.g_ActiveInventory.selectedItem;
		if(item.checkedForSend){
			item.checkedForSend=false;
			item.element.removeClassName('checkedForSend');
			if(item._amount>1){
				for(var i=0;i<item._amount;i++){
					delete W.checkedForSend[item._ids[i]];
				}
			} else {
				delete W.checkedForSend[giftId];
			}

		} else {
			var amount = 1;
			if(item._amount>1) {
				amount =  parseInt(prompt(t('howmany')+item._amount, item._amount)) || 1;
				if (amount>item._amount)
					amount=item._amount;
			}
			if(amount>1){
				if(!confirm(t('Skip sent?'))) for(var i=0;i<amount;i++){
					W.checkedForSend[item._ids[i]]=item.name;
					item._subItems[i].element.addClassName('checkedForSend');
				}
				else for(var i=0;i<amount;i++){
					var sitem = item._subItems[i],
						skipit = false;
					if(sitem.owner_descriptions) for(var j=0;j<sitem.owner_descriptions.length;j++){
						if(sitem.owner_descriptions[j].value.match(/data-miniprofile=|\S+@\S+/i)){
							skipit = true;
							break;
						}
					}
					if(!skipit) {
						W.checkedForSend[item._subItems[i].id]=item.name;
						item._subItems[i].element.addClassName('checkedForSend');
					}
				}
			} else {
				W.checkedForSend[giftId]=item.name;
				item.checkedForSend=true;
				item.element.addClassName('checkedForSend');
			}
		}
	}
	W.sendChecked = function(){
		var url = 'http://store.steampowered.com/checkout/sendgift/';
		// first to gid
		for(var gid in W.checkedForSend){
			break;
		}

		url+=gid+'#multisend='+encodeURIComponent(JSON.stringify(W.checkedForSend));

		W.location.href=url;

	}
	// END multi gifts sending


	if(W.g_bViewingOwnProfile){

		//// gifts notes
		var giftsNotes = W.localStorage.giftsNotes;
		if(giftsNotes)
			giftsNotes = JSON.parse(giftsNotes);
		else giftsNotes={};
		W.loadGiftNote = function(){
			var gid = W.g_ActiveInventory.selectedItem.id;
			if(!$('#iteminfo'+W.iActiveSelectView+'_item_tags_content textarea.giftnote').length)
				$('#iteminfo'+W.iActiveSelectView+'_item_tags_content').append('<br/><textarea class="giftnote" style="width:100%">'+(giftsNotes[gid]||'')+'</textarea><button onclick="saveGiftNote(\''+gid+'\')">'+t('save')+'</button>');
		}
		W.saveGiftNote = function(gid){
			giftsNotes[gid]=$('#iteminfo'+W.iActiveSelectView+'_content textarea.giftnote').val();
			W.localStorage.giftsNotes = JSON.stringify(giftsNotes);
		}

		// accept all gifts Btn
		var el = $('div.pending_gift:first');
		if(el.length){
			el.before('<a id="swt_acceptAllGifts" class="btn_darkblue_white_innerfade btn_medium new_trade_offer_btn" href="#"><span>'+t('acceptAllToInv')+'</span></a>');
			$('#swt_acceptAllGifts').click(function(e){
				e.preventDefault();
				var pg = $('div.pending_gift');
				if(pg.length){
					var gid;
					pg=pg.find('>div[id^="pending_gift_"]');
					for(var i=0; i<pg.length; i++){
						gid = pg[i].id.split('_')[2];
						DoAcceptGift(gid, false);
					}
				}
			});
		}
	}

	//// action for gifts and items
	var BuildHover_orig = W.BuildHover;
	W.BuildHover = function(){
		var item = arguments[1];
		// gifts
		if(W.g_ActiveInventory && (W.g_ActiveInventory.appid == 753)){
			if ((item.contextid==1) && !item.descriptions.withClassid) {
				item.descriptions.withClassid=true;

				if(!item.descriptions)
					item.descriptions = [];

				item.descriptions.push({value:'ClassID = '+item.classid});
				if(W.g_bViewingOwnProfile)
					item.descriptions.push({value:'<a href="#" onclick="getSubid(event.target,\''+item.id+'\');return false">'+t('get')+' SubscriptionID</a>',type:'html'});

				if(!ajaxTarget.descriptions[item.classid])
					ajaxTarget.descriptions[item.classid] = item.descriptions;


				if(item.owner_actions) {
					item.owner_actions.push({
						link:'javascript:checkForSend("%assetid%")',
						name:t('checkForSend')
					});
					item.owner_actions.push({
						link:'javascript:sendChecked()',
						name:t('sendChecked')
					});
					item.owner_actions.push({
						link:'javascript:loadGiftNote()',
						name:t('showNote')
					});
				}
			}
		}

		return BuildHover_orig.apply(this, arguments);
	}


	//// View in Market Button
	// for foreign inventory
	if (!W.g_bViewingOwnProfile){
		var PopulateMarketActions_orig = W.PopulateMarketActions;
		W.PopulateMarketActions = function (elActions, item) {
			var res = PopulateMarketActions_orig.apply(this, arguments);
			if (!item.marketable) {
				return res;
			}
			var market_hash_name = item.market_hash_name ? item.market_hash_name : item.market_name;
			elActions.appendChild(W.CreateMarketActionButton('blue', 'http://steamcommunity.com/market/listings/'+item.appid+'/'+market_hash_name, t('minMarketPrice')+': <span id="swt_lowestItemPrice_'+item.classid+'">?</span>'));
			$(elActions).css('display', 'block');
			$.ajax( {
				url: 'http://steamcommunity.com/market/priceoverview/',
				type: 'GET',
				data: {
					country: W.g_strCountryCode,
					currency: typeof(W.g_rgWalletInfo) != 'undefined' ? W.g_rgWalletInfo['wallet_currency'] : 1,
					appid: item.appid,
					market_hash_name: market_hash_name
				}
			} ).done( function ( data ) {
				var price=t('reqErr');
				if(data.success){
					price=data.lowest_price
				}
				$('#swt_lowestItemPrice_'+item.classid).html(price);
			} ).fail(function(jqxhr) {
				$('#swt_lowestItemPrice_'+item.classid).text(t('reqErr'));
			} );


			return res;
		}
	}

	//// inv

	// == hide dup work with another filters
	W.Filter.UpdateTagFiltering_old = W.Filter.UpdateTagFiltering;
	W.Filter.UpdateTagFiltering = function(rgNewTags){
		if (W.localStorage.hideDupItems) {
			rgNewTags['SWT']=['notdup'];
		}
		return this.UpdateTagFiltering_old.call(this, rgNewTags);
	}
	// == /hide dup

	var SelectInventoryFromUser_old = W.SelectInventoryFromUser;
	W.SelectInventoryFromUser = function( user, appid, contextid, bForceSelect ){
		if (!bForceSelect) {
			return SelectInventoryFromUser_old.apply(this, arguments);
		}
		var inventory = W.UserYou.getInventory( appid, contextid );

		// == Fix Bug : The old page is shown below after use filter
		/*
		if(!inventory.SetActivePage_old){
			inventory.SetActivePage_old = inventory.SetActivePage;
			inventory.SetActivePage = function(){
				$('.inventory_page').hide();
				return inventory.SetActivePage_old.apply(this, arguments);
			}
		}
		*/
		if(!inventory.SetActivePage_old){
			inventory.SetActivePage_old = inventory.SetActivePage;
			inventory.SetActivePage = function( iPage )
			{
				if ( this.BIsPendingInventory() )
				{
					// just hold on to the value
					this.pageCurrent = iPage;
					return;
				}

				if ( iPage >= this.pageTotal )
					return;

				// we may have removed pages
				//if ( this.pageCurrent >= 0 && this.pageCurrent < this.pageTotal ) // FIX
					this.pageList[this.pageCurrent].hide();

				this.pageList[iPage].show();
				this.pageCurrent = iPage;
				this.UpdatePageCounts();


				this.PreloadPageImages( this.pageCurrent );
			}
		}
		// == / Fix Bug


		if(!inventory.BuildItemElement_old){
			inventory.BuildItemElement_old = inventory.BuildItemElement;
			inventory.BuildItemElement = function(){
				var el = inventory.BuildItemElement_old.apply(this, arguments);
				var fncs = this.BuildItemElement.fncs;
				for (var i=0;i<fncs.length;i++) {
					fncs[i].apply(this, [el]);
				}
				return el;
			};
			inventory.BuildItemElement.fncs=[];
		}

		if (appid==730) { //CSGO
			// Item color by Rarity
			if(!inventory.BuildItemElement.fncs.csgoItemColor) {
				inventory.BuildItemElement.fncs.csgoItemColor = true;
				inventory.BuildItemElement.fncs.push(function(el){
					var icons='<div class="swt_icon">',
						tags = el.rgItem.tags;
					for (var i=0;i<tags.length;i++) {
						switch (tags[i].category) {
							case "Quality":
								switch (tags[i].internal_name) {
									case "strange":
										icons+='<span class="swt_icon-st">ST</span>';
										break;
									case "unusual":
										el.style.borderColor='#'+tags[i].color;
										tags.colored=true;
										break;
									case "tournament":
										icons+='<span class="swt_icon-t">S</span>';
										break;
								}
								break;
							case "Rarity":
								if (!tags.colored)
									el.style.borderColor='#'+tags[i].color;
								break;
						}
					};
					el.innerHTML+=icons+'</div>';
				});
			}
		}

		if (!inventory._hiddenDup) {
			// display amount
			if(!inventory.BuildItemElement.fncs.itemcount) {
				inventory.BuildItemElement.fncs.itemcount = true;
				inventory.BuildItemElement.fncs.push(function(el){
					if (el.rgItem._dup) {
						$(el).addClass("swt_itemdup");
					}
					var a = el.rgItem._amount;
					if (!a) return;
					el.innerHTML+='<div class="itemcount">x'+a+'</div>';
				});
			}

			inventory.MakeActive_old = inventory.MakeActive;
			inventory.MakeActive = function(){
				var res = inventory.MakeActive_old.apply(this, arguments);
				hideDupFilter();
				return res;
			}


			var itemsA = [],
				chinv;

			if(chinv=inventory.rgChildInventories) {
				for(var x in chinv){
					chinv[x].BuildItemElement = inventory.BuildItemElement; // display count
					chinv[x].MakeActive = inventory.MakeActive; // display count
					itemsA.push(chinv[x].rgInventory);
				}
			} else {
				if(inventory.rgInventory)
					itemsA.push(inventory.rgInventory);
			}

			if(itemsA.length){
				inventory._hiddenDup = true;
				var items, newItems;
				for(var i=0; i<itemsA.length; i++){
					items = itemsA[i];
					newItems=[];

					var itm,nitm;
					for ( var j in items ){
						itm = items[j];
						if(itm._is_stackable || itm.is_stackable)
							continue;
						if(nitm = newItems[itm.classid]){
							nitm._amount +=1;
							nitm._ids.push(itm.id);
							nitm._subItems.push(itm);
						} else {
							itm._is_stackable = true;
							itm._amount = 1;
							itm._ids = [itm.id];
							itm._subItems = [itm];

							itm.tags.push({category: "SWT",
								category_name: "SteamWebTools",
								internal_name: "notdup",
								name: "HideDup"}
							);
							newItems[itm.classid] = itm;
						}
					}
				}
			}

		}

		return SelectInventoryFromUser_old.apply(this, arguments);
	}


	var HTMLHideDup = '<input type="checkbox" name="hidedup" onchange="window.onchangehidedup(event)" '+((W.localStorage.hideDupItems)?'checked="true"':'')+'/>'+t('hideDup');
	document.getElementById('inventory_pagecontrols').insertAdjacentHTML("beforeBegin", HTMLHideDup);

	/**
	 * SIH v1.10.1 fix sort items
	 **/
	setTimeout(function(){
		if (!SortItem) return;
		var SortItem_old = SortItem;
		W.SortItem = function () {
			if(!W.$J('#Lnk_SortItems').data('asc')) return;
			SortItem_old.apply(W, arguments);
		}
	}, 1500);
	// END fix

	var hideDupFilter = function (){
		if(W.localStorage.hideDupItems){
			W.Filter.rgCurrentTags['SWT']=['notdup'];
			W.Filter.OnFilterChange();
			$('.itemcount').show();
		} else {
			delete W.Filter.rgCurrentTags.SWT;
			W.Filter.rgLastTags['SWT']=['notdup'];
			W.Filter.OnFilterChange();
			$('.itemcount').hide();
		}
		// return to page selectedItem
		if(W.g_ActiveInventory.selectedItem)
			W.g_ActiveInventory.EnsurePageActiveForItem( W.g_ActiveInventory.selectedItem.element );
	}

	W.onchangehidedup = function(e){
		if(e.target.checked){
			W.localStorage.hideDupItems = 1;
		} else {
			W.localStorage.removeItem('hideDupItems');
		}
		hideDupFilter();



	};

	//// sell dialog accept ssa checked
	$('#market_sell_dialog_accept_ssa').attr('checked',true);

	//// multisell
	W.SellItemDialog.OnConfirmationAccept_old = W.SellItemDialog.OnConfirmationAccept;
	var SellCurrentSelection_old = W.SellCurrentSelection;
	W.SellCurrentSelection = function(){
		var res = SellCurrentSelection_old.apply(this, arguments);
		var count = W.g_ActiveInventory.selectedItem._amount;

		// unbind Sell btn
		W.$('market_sell_dialog_ok').stopObserving();
		$('#market_sell_dialog_ok').unbind();

		if(count>1) {
			var amount =  parseInt(prompt(t('howmany')+count, count)) || 1;
			if (amount>count)
				amount=count;

			if(amount>1){
				W.SellItemDialog._amount=amount;
				W.SellItemDialog._itemNum=0;
				W.SellItemDialog._itemsFailNum=0;
				W.SellItemDialog.OnConfirmationAccept_new = function(event){

					W.$('market_sell_dialog_error').hide();
					W.$('market_sell_dialog_ok').fade({duration:0.25});
					W.$('market_sell_dialog_back').fade({duration:0.25});
					W.$('market_sell_dialog_throbber').show();
					W.$('market_sell_dialog_throbber').fade({duration:0.25,from:0,to:1});

					var item;
					do {
						item = W.SellItemDialog.m_item._subItems[W.SellItemDialog._itemNum];
						W.SellItemDialog._itemNum++;
					} while(!item.marketable);
					W.SellItemDialog.m_item.id=item.id;

					$.ajax( {
						url: 'https://steamcommunity.com/market/sellitem/',
						type: 'POST',
						data: {
							sessionid: W.g_sessionID,
							appid: W.SellItemDialog.m_item.appid,
							contextid: W.SellItemDialog.m_item.contextid,
							assetid: W.SellItemDialog.m_item.id,
							amount: W.SellItemDialog.m_nConfirmedQuantity,
							price: W.SellItemDialog.m_nConfirmedPrice
						},
						crossDomain: true,
						xhrFields: { withCredentials: true }
					} ).done( function ( data ) {
						$('#market_sell_dialog_item_availability_hint>.market_dialog_topwarning').text(t('listed')+W.SellItemDialog._itemNum+(W.SellItemDialog._itemsFailNum ? ' | '+t('skipped')+W.SellItemDialog._itemsFailNum : ''));
						if(W.SellItemDialog._itemNum>=W.SellItemDialog._amount)
							W.SellItemDialog.OnSuccess.apply(W.SellItemDialog, [{ responseJSON: data }])
						else {
							return W.SellItemDialog.OnConfirmationAccept_new.apply(W.SellItemDialog, arguments);
						}
					} ).fail( function( jqxhr ) {
						// jquery doesn't parse json on fail
						var data = $.parseJSON( jqxhr.responseText );
						W.SellItemDialog._itemsFailNum++;
						if(W.SellItemDialog._itemNum>=W.SellItemDialog._amount)
							W.SellItemDialog.OnFailure( { responseJSON: data } );
						else {
							return W.SellItemDialog.OnConfirmationAccept_new.apply(W.SellItemDialog, arguments);
						}
					} );

				}
				W.SellItemDialog.OnConfirmationAccept = W.SellItemDialog.OnConfirmationAccept_new;
			} else {
				W.SellItemDialog.OnConfirmationAccept = W.SellItemDialog.OnConfirmationAccept_old;
			}


		} else
			W.SellItemDialog.OnConfirmationAccept = W.SellItemDialog.OnConfirmationAccept_old;
		$('#market_sell_dialog_ok').on("click", $.proxy(W.SellItemDialog.OnConfirmationAccept, W.SellItemDialog));
		//W.$('market_sell_dialog_ok').observe( 'click', W.SellItemDialog.OnConfirmationAccept.bindAsEventListener(W.SellItemDialog) );

		return res;
	}



}


if (W.g_strInventoryLoadURL) {
	inventoryPageInit();
}
