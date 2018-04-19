var $ = W.$J;

function inventoryPageInit(){
	var SWT_NOT_DUP_KEY = 'swt_notdup';
	// for subid detect
	var ajaxTarget = {descriptions:[]};

	W.getSubid = function(target){
		ajaxTarget.element = target;

		var item = W.g_ActiveInventory.selectedItem;

		ajaxTarget.classid = item.classid;
		ajaxTarget.giftId = item.assetid;
		ajaxTarget.giftName = encodeURIComponent(item.description.name);

		new W.Ajax.Request( '//steamcommunity.com/gifts/' + ajaxTarget.giftId + '/validateunpack', {
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
		ds[ds.length-1]={value:str, type:'html'};
		ds.withSubid=true;
	}


	// styles
	document.body.insertAdjacentHTML("afterBegin",
		'<style>.checkedForSend{background:#366836!important}.itemcount{background:#292929;color:#FFF;font-weight:700;position:absolute;right:0;top:0}.swt_icon{position:absolute;top:0;left:0}.swt_icon-st{background:#CF6A32;color:#fff}.swt_icon-t{background:#FDEC14;color:#000}#inventory_logos{display:none}.swt_hidden{display:none}</style>'
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
					W.checkedForSend[item._ids[i]]=item.description.name;
					item._subItems[i].element.addClassName('checkedForSend');
				}
				else for(var i=0;i<amount;i++){
					var sitem = item._subItems[i],
						skipit = false;
					if(sitem.description.owner_descriptions) for(var j=0;j<sitem.description.owner_descriptions.length;j++){
						if(sitem.description.owner_descriptions[j].value.match(/data-miniprofile=|\S+@\S+/i)){
							skipit = true;
							break;
						}
					}
					if(!skipit) {
						W.checkedForSend[item._subItems[i].assetid]=item.description.name;
						item._subItems[i].element.addClassName('checkedForSend');
					}
				}
			} else {
				W.checkedForSend[giftId]=item.description.name;
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
			var gid = W.g_ActiveInventory.selectedItem.assetid;
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
	W.BuildHover = function( sNewInfo, item, UserYou ){
		// gifts
		if(W.g_ActiveInventory && (W.g_ActiveInventory.appid == 753)){
			if ((item.contextid==1) && !(item.description && item.description.descriptions && item.description.descriptions.withClassid)) {

				if(!item.description.descriptions)
					item.description.descriptions = [];

				item.description.descriptions.withClassid=true;

				item.description.descriptions.push({value:'ClassID = '+item.classid});
				if(W.g_bViewingOwnProfile)
					item.description.descriptions.push({value:'<a href="#" onclick="getSubid(event.target);return false">'+t('get')+' SubscriptionID</a>',type:'html'});

				if(!ajaxTarget.descriptions[item.classid])
					ajaxTarget.descriptions[item.classid] = item.description.descriptions;


				if(item.description.owner_actions) {
					item.description.owner_actions.push({
						link:'javascript:checkForSend("%assetid%")',
						name:t('checkForSend')
					});
					item.description.owner_actions.push({
						link:'javascript:sendChecked()',
						name:t('sendChecked')
					});
					item.description.owner_actions.push({
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
			var itmdescr = item.description;
			if (!itmdescr.marketable) {
				return res;
			}
			var market_hash_name = itmdescr.market_hash_name || itmdescr.market_name;
			elActions.appendChild(W.CreateMarketActionButton('blue', 'http://steamcommunity.com/market/listings/'+item.appid+'/'+market_hash_name, t('minMarketPrice')+': <span id="swt_lowestItemPrice_'+item.classid+'">?</span>'));
			$(elActions).css('display', 'block');
			$.ajax( {
				url: '//steamcommunity.com/market/priceoverview/',
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

	/* *
	 * Hide dup items functions
	 * */

	// == hide dup work with another filters
	W.Filter.UpdateTagFiltering_old = W.Filter.UpdateTagFiltering;
	W.Filter.UpdateTagFiltering = function(rgNewTags){
		if (W.localStorage.hideDupItems) {
			rgNewTags['SWT']=[SWT_NOT_DUP_KEY];
		}
		return this.UpdateTagFiltering_old.apply(this, arguments);
	}
	// check dup in original item data
	W.Filter.MatchItemTags_old = W.Filter.MatchItemTags;
	W.Filter.MatchItemTags = function( elItem, rgTags ){
		if (rgTags && rgTags[0]==SWT_NOT_DUP_KEY) {
			return (elItem.rgItem._amount > 0) || (elItem.rgItem.amount > 1) ;
		} else
			return this.MatchItemTags_old.apply(this, arguments);
	}

	// on change inv
	W.CInventory.prototype.show_old = W.CInventory.prototype.show;
	W.CInventory.prototype.show = function(){
		var res = W.CInventory.prototype.show_old.apply(this, arguments);
		hideDupFilter();
		return res;
	}
	var hideDupFilter = function (){
		if(W.localStorage.hideDupItems){

			W.Filter.rgCurrentTags['SWT']=[SWT_NOT_DUP_KEY];

			var applyDupFilter = function(){
				W.Filter.OnFilterChange();

				if (W.g_ActiveInventory._hideDupCounters) {
					$('.itemcount', W.g_ActiveInventory.m_$Inventory).show();
				} else {
					$('.itemcount', W.g_ActiveInventory.m_$Inventory).each(function(i, el){
						var $el = $(el);
						var firstItems;
						if (W.g_ActiveInventory.m_rgChildInventories) {
							firstItems = {};
							for(var context in W.g_ActiveInventory.m_rgChildInventories){
								$.extend(firstItems, W.g_ActiveInventory.m_rgChildInventories[context]._firstItems);
							}
						} else {
							firstItems = W.g_ActiveInventory._firstItems;
						}

						$el .text('x'+firstItems[$el.data('classid')]._amount)
							.show();
					});
					W.g_ActiveInventory._hideDupCounters = true;
				};
			}

			W.g_ActiveInventory.LoadCompleteInventory().done(applyDupFilter);

		} else {
			delete W.Filter.rgCurrentTags.SWT;
			W.Filter.rgLastTags['SWT']=[SWT_NOT_DUP_KEY];
			W.Filter.OnFilterChange();
			$('.itemcount').hide();
		}
		// return to page selectedItem
		if(W.g_ActiveInventory.selectedItem)
			W.g_ActiveInventory.EnsurePageActiveForItem( W.g_ActiveInventory.selectedItem.element );
	}

	// check box click
	W.onchangehidedup = function(e){
		if(e.target.checked){
			W.localStorage.hideDupItems = 1;
		} else {
			W.localStorage.removeItem('hideDupItems');
		}
		hideDupFilter();
	};

	// activate filter onload page
	var checkHideDupFilter = function(){
		if (W.g_ActiveInventory && W.g_ActiveInventory.m_bActive) {
			hideDupFilter()
		} else {
			setTimeout(checkHideDupFilter, 1000);
		}
	}
	checkHideDupFilter();
	// == END hide dup functions


	W.CInventory.prototype.BuildItemElement_old = W.CInventory.prototype.BuildItemElement;
	W.CInventory.prototype.BuildItemElement = function(asset){
		var $el = W.CInventory.prototype.BuildItemElement_old.apply(this, arguments);

		if (asset.appid==730) { //CSGO
			// Item color by Rarity
			var icons='<div class="swt_icon">',
				tags = asset.description.tags;
			for (var i=0;i<tags.length;i++) {
				switch (tags[i].category) {
					case "Quality":
						switch (tags[i].internal_name) {
							case "strange":
								icons+='<span class="swt_icon-st">ST</span>';
								break;
							case "unusual":
								$el.css('border-color', '#'+tags[i].color);
								tags.colored=true;
								break;
							case "tournament":
								icons+='<span class="swt_icon-t">S</span>';
								break;
						}
						break;
					case "Rarity":
						if (!tags.colored)
							$el.css('border-color', '#'+tags[i].color);
						break;
				}
			};
			$el.append(icons+'</div>');


		}

		// below hide dup fn only
		if (asset.is_stackable) {
			return;
		}

		if (!this._firstItems) {
			this._firstItems={};
		}
		var fi; // first items with same classId
		if (fi = this._firstItems[asset.classid]) {
			fi._amount++;

			fi._ids.push(asset.assetid);
			fi._subItems.push(asset);

		} else {
			asset._amount=1;
			asset._is_stackable = true;
			asset._subItems = [asset];
			asset._ids = [asset.assetid];

			this._firstItems[asset.classid]=asset;

			$el.append('<div class="itemcount" data-classid="'+asset.classid+'"></div>');
			asset.description.tags.push({
				category: "SWT",
				internal_name: "swt_notdup",
				localized_category_name: "Steam Web Tools",
				localized_tag_name: "Hide Dup"
			});
		}

		return $el;
	}

	// == Fix Steam Bug : The old page is shown below after use filter
	W.CInventory.prototype.SetActivePage_old = W.CInventory.prototype.SetActivePage;
	W.CInventory.prototype.SetActivePage = function( iPage ) {
		if ( iPage >= this.m_cPages )
			return;

		//if ( this.m_iCurrentPage >= 0 && this.m_iCurrentPage < this.m_cPages ) // FIX
			this.m_rgPages[ this.m_iCurrentPage ].hide();

		this.m_rgPages[iPage].show();
		this.m_iCurrentPage = iPage;
		this.UpdatePageCounts();

		this.PreloadPageImages( this.m_iCurrentPage );
	}
	// == / Fix Steam Bug


	// insert check box - hide dup items
	$('#inventory_pagecontrols').before('<label><input type="checkbox" name="hidedup" onchange="window.onchangehidedup(event)" '+((W.localStorage.hideDupItems)?'checked="true"':'')+'/>'+t('hideDup')+'</label>');

	/**
	 * SIH v1.10.1 fix sort items
	 **/
	setTimeout(function(){
		if (!W.SortItem) return;
		var SortItem_old = W.SortItem;
		W.SortItem = function () {
			if(!W.$J('#Lnk_SortItems').data('asc')) return;
			SortItem_old.apply(W, arguments);
		}
	}, 1500);
	// END fix


	//// sell dialog accept ssa checked
	$('#market_sell_dialog_accept_ssa').prop('checked',true);



	/*
	 * Multisell
	 */

	//// set lowest price btn
	$('#market_sell_dialog_input_area').before('<div style="text-align:right;margin-bottom:0.5em;"><a href="#" id="swt_setpricebtn">['+t('setlowestprice')+' -0,01]</a></div>');
	$('#swt_setpricebtn').click(function(e){
		e.preventDefault();
		var item = W.SellItemDialog.m_item;
		var strMarketName = GetMarketHashName( item.description );
		new W.Ajax.Request( '//steamcommunity.com/market/priceoverview/', {
			method: 'get',
			parameters: {
				country: W.g_strCountryCode,
				currency: typeof( W.g_rgWalletInfo ) != 'undefined' ? W.g_rgWalletInfo['wallet_currency'] : 1,
				appid: item.appid,
				market_hash_name: strMarketName
			},
			onSuccess: function( transport ) {
				if ( transport.responseJSON && transport.responseJSON.success ){
					var price = W.GetPriceValueAsInt(transport.responseJSON.lowest_price);
					price--;

					$('#market_sell_buyercurrency_input').val(W.v_currencyformat(price, W.GetCurrencyCode(W.g_rgWalletInfo['wallet_currency'])));
					W.SellItemDialog.OnBuyerPriceInputKeyUp();
				}
			}
		});

	});

	var sellWarningBlock = {};
	sellWarningBlock.el = $('#market_sell_dialog_item_availability_hint>.market_dialog_topwarning');
	sellWarningBlock.orgnText = sellWarningBlock.el.text();

	W.SellItemDialog.OnConfirmationAccept_old = W.SellItemDialog.OnConfirmationAccept;
	var SellCurrentSelection_old = W.SellCurrentSelection;
	W.SellCurrentSelection = function(){
		sellWarningBlock.el.text(sellWarningBlock.orgnText);
		var res = SellCurrentSelection_old.apply(this, arguments);
		var count = W.g_ActiveInventory.selectedItem._amount;

		// unbind Sell btn
		W.$('market_sell_dialog_ok').stopObserving();
		$('#market_sell_dialog_ok').unbind();

		if(count>1) {
			var amount =  parseInt(prompt(t('howmany')+count, count)) || 1;
			amount = Math.min(amount, count);

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
					} while(!item.description.marketable);
					W.SellItemDialog.m_item.assetid=item.assetid;

					$.ajax( {
						url: 'https://steamcommunity.com/market/sellitem/',
						type: 'POST',
						data: {
							sessionid: W.g_sessionID,
							appid: W.SellItemDialog.m_item.appid,
							contextid: W.SellItemDialog.m_item.contextid,
							assetid: W.SellItemDialog.m_item.assetid,
							amount: W.SellItemDialog.m_nConfirmedQuantity,
							price: W.SellItemDialog.m_nConfirmedPrice
						},
						crossDomain: true,
						xhrFields: { withCredentials: true }
					} ).done( function ( data ) {
						sellWarningBlock.el.text(
							t('listed')+ W.SellItemDialog._itemNum +' / '+amount+
							(W.SellItemDialog._itemsFailNum ? ' | '+t('skipped')+W.SellItemDialog._itemsFailNum : '')
						);
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
	if (!W.CInventory.prototype.LoadCompleteInventory) return; // fix for old scripts in ?modal=1&market=1
	inventoryPageInit();
}
