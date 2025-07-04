var $ = W.$J;

function inventoryPageInit(){

	// prefer using SIH func for compatibility
	function getPriceAsInt(){
		return (W.getPriceAsInt ?? W.GetPriceValueAsInt).apply(this, arguments);
	}

	function getMarketPrice(appid, market_hash_name){
		return $.ajax( {
			url: '//steamcommunity.com/market/priceoverview/',
			type: 'GET',
			cache: true,
			data: {
				country: W.g_strCountryCode,
				currency: W.g_rgWalletInfo?.wallet_currency ?? 1,
				appid,
				market_hash_name
			}
		} )
	}


	// only for gifts inv
	var ajaxTarget;
	// @dev W.ShowItemInventory - it is called before the userscript
	function initGiftsInvFeatures(){
		if(W.getSubid) return;

		// for subid detect
		ajaxTarget = {descriptions:[]};
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
					W.setSubID(transport.responseJSON.packageid, ajaxTarget);
				}
			});
		}
		W.setSubID=function(subid, ajaxTarget){
			var str = 'SubscriptionID = <a href="https://steamdb.info/sub/'+subid+'">'+subid+'</a>';
			ajaxTarget.element.outerHTML=str;
			var ds = ajaxTarget.descriptions[ajaxTarget.classid];
			ds[ds.length-1]={value:str, type:'html'};
			ds.withSubid=true;
		}

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
					if(!confirm(t('skipSent'))) for(var i=0;i<amount;i++){
						W.checkedForSend[item._ids[i]]=item.description.name;
						item._subItems[i].element.addClassName('checkedForSend');
					}
					else for(var i=0;i<amount;i++){
						let sitem = item._subItems[i],
							skipit = false;
						if(sitem.description.owner_descriptions)
							for(let j=0; j<sitem.description.owner_descriptions.length; ++j){
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
			var url = 'https://store.steampowered.com/checkout/sendgift/';
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
		}
	}


	// styles
	document.body.insertAdjacentHTML("afterBegin",
		'<style>.checkedForSend{background:#366836!important}.itemcount{display:var(--itemcountDisp);background:#292929;color:#a0dcff;font-weight:700;float:right}.swt_icon{float:left}.swt_icon-st{background:#CF6A32;color:#fff}.swt_icon-t{background:#FDEC14;color:#000}#inventory_logos{display:none}</style>'
	);


	if(W.g_bViewingOwnProfile){
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
		if(W.g_ActiveInventory?.appid == 753){
			initGiftsInvFeatures();
			if ((item.contextid==1) && !item.description?.descriptions?.withClassid) {

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
						name:'✔️'+t('checkForSend')
					},{
						link:'javascript:sendChecked()',
						name:'📨'+t('sendChecked')
					},{
						link:'javascript:loadGiftNote()',
						name:'📝'+t('showNote')
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
			elActions.appendChild(W.CreateMarketActionButton('blue', `//steamcommunity.com/market/listings/${item.appid}/${market_hash_name}`, `${t('minMarketPrice')}: <span id="swt_lowestItemPrice_${item.classid}">?</span>`));
			$(elActions).css('display', 'block');
			getMarketPrice(item.appid, market_hash_name)
			.done( function ( data ) {
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

	// == search in tags
	W.Filter.MatchItemTerms_old = W.Filter.MatchItemTerms;
	W.Filter.MatchItemTerms = function(elItem, rgTerms){
		var res =  this.MatchItemTerms_old.apply(this, arguments);
		if(res) return res;
		var tags = elItem.rgItem.description.tags;

		for ( var iTerm = 0; iTerm < rgTerms.length; iTerm++ ) {
			var bMatch = false;

			if ( tags?.length )
				for ( var i = 0; i < tags.length; i++ )
				{
					if ( tags[i].internal_name?.match( rgTerms[iTerm] ) )
					{
						bMatch = true;
						break;
					}
				}

			if ( !bMatch )
				return false;
		}
		return true;
	}

	/* *
	 * Hide dup items functions
	 * */

	class FilterTag{
		constructor(name, value){
			this.localized_tag_name = name;
			this.internal_name = value;
		}
		category = "SWT";
		localized_category_name = "Steam Web Tools";
	}

	var tagHideDup = new FilterTag("Hide Dup",    "notdup"),
		tagMore1   = new FilterTag("More than 1", "more1");



	// == hide dup work with another filters
	W.Filter.UpdateTagFiltering_old = W.Filter.UpdateTagFiltering;
	W.Filter.UpdateTagFiltering = function(rgNewTags){
		if (W.localStorage.hideDupItems) {
			if(rgNewTags[tagHideDup.category])
				rgNewTags[tagHideDup.category].unshift(tagHideDup.internal_name)
			else
				rgNewTags[tagHideDup.category]=[tagHideDup.internal_name];
		}
		return this.UpdateTagFiltering_old.apply(this, arguments);
	}
	// check dup in original item data
	W.Filter.MatchItemTags_old = W.Filter.MatchItemTags;
	W.Filter.MatchItemTags = function( elItem, rgTags ){
		if (rgTags?.[0] == tagHideDup.internal_name) {
			return (elItem.rgItem._amount > (rgTags?.[1] == tagMore1.internal_name ? 1 : 0))
				|| (elItem.rgItem.amount > 1) ;
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

			W.Filter.rgCurrentTags[tagHideDup.category]=[tagHideDup.internal_name];

			var applyDupFilter = function(){
				W.Filter.OnFilterChange();

				// create counters
				if (!W.g_ActiveInventory._hideDupCounters) {
					var firstItems;
					if (W.g_ActiveInventory.m_rgChildInventories) {
						firstItems = {};
						for(var context in W.g_ActiveInventory.m_rgChildInventories){
							Object.assign(firstItems, W.g_ActiveInventory.m_rgChildInventories[context]._firstItems);
						}
					} else {
						firstItems = W.g_ActiveInventory._firstItems;
					}
					$('.itemcount', W.g_ActiveInventory.m_$Inventory).each(function(i, el){
						var $el = $(el);
						let amount = firstItems[$el.data('classid')]._amount;
						$el .text('x'+amount)

						if(amount==1){
							$el.attr('style', 'font-weight:normal;color:#7e7e7e');
						}
					});
					W.g_ActiveInventory._hideDupCounters = true;
				};

				W.tabcontent_inventory.style.setProperty("--itemcountDisp", "block");
			}

			W.g_ActiveInventory.LoadCompleteInventory().done(applyDupFilter);

		} else {
			delete W.Filter.rgCurrentTags[tagHideDup.category];
			W.Filter.rgLastTags[tagHideDup.category]=[tagHideDup.internal_name];
			W.Filter.OnFilterChange();
			W.tabcontent_inventory.style.setProperty("--itemcountDisp", "none");
		}
		// return to page selectedItem
		if(W.g_ActiveInventory.selectedItem)
			W.g_ActiveInventory.EnsurePageActiveForItem( W.g_ActiveInventory.selectedItem.element );
	}

	// activate filter onload page
	var checkHideDupFilter = function(){
		if (W.g_ActiveInventory?.m_bActive) {
			hideDupFilter()
		} else {
			setTimeout(checkHideDupFilter, 1000);
		}
	}

	// fix steam scripts with old limit per load
	W.Filter.FILTER_ASSETS_PER_LOAD = 2500;
	W.CInventory.prototype.LoadMoreAssets_old = W.CInventory.prototype.LoadMoreAssets;
	W.CInventory.prototype.LoadMoreAssets = function(count){
		if(count>W.Filter.FILTER_ASSETS_PER_LOAD)
			count = W.Filter.FILTER_ASSETS_PER_LOAD;
		return W.CInventory.prototype.LoadMoreAssets_old.apply(this, arguments)
	}

	checkHideDupFilter();
	// == END hide dup functions


	W.CInventory.prototype.BuildItemElement_old = W.CInventory.prototype.BuildItemElement;
	W.CInventory.prototype.BuildItemElement = function(asset){
		var $el = W.CInventory.prototype.BuildItemElement_old.apply(this, arguments);

		if (asset.appid==730) { //CSGO
			// Item color by Rarity
			var icons='',
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
			if(icons)
				$el.find('a.inventory_item_link').append('<div class="swt_icon">'+icons+'</div>');


		}

		// below hide dup fn only
		if (asset.is_stackable) {
			return $el;
		}

		if (!this._firstItems) {
			this._firstItems={};
		}
		var fi; // first items with same classId
		if (fi = this._firstItems[asset.classid]) {
			if(++fi._amount == 2){
				fi.description.tags.push(tagMore1);
			}

			fi._ids.push(asset.assetid);
			fi._subItems.push(asset);

		} else {
			asset._amount=1;
			asset._is_stackable = true;
			asset._subItems = [asset];
			asset._ids = [asset.assetid];

			this._firstItems[asset.classid]=asset;

			$el.find('a.inventory_item_link').append('<span class="itemcount" data-classid="'+asset.classid+'"></span>');
			asset.description.tags.push(tagHideDup);
		}

		return $el;
	}

	// insert check box - hide dup items
	$(`<label><input type="checkbox" ${((W.localStorage.hideDupItems)?'checked="true"':'')}/>${t('hideDup')}</label>`)
	.insertBefore('#inventory_pagecontrols')
	.find('input').change(function(e){
		if(e.target.checked){
			W.localStorage.hideDupItems = 1;
		} else {
			W.localStorage.removeItem('hideDupItems');
		}
		hideDupFilter();
	});


	//// sell dialog accept ssa checked
	$('#market_sell_dialog_accept_ssa').prop('checked',true);



	/*
	 * Multisell
	 */

	//// set lowest price btn
	$('#market_sell_dialog_input_area').before('<div style="text-align:right;margin-bottom:0.5em;"><a href="#" id="swt_setpricebtn">['+t('setlowestprice')+(settings.cur.invSellItemSetPriceDiff>0?' +':' -')
	+W.v_currencyformat(settings.cur.invSellItemSetPriceDiff, W.GetCurrencyCode(W.g_rgWalletInfo['wallet_currency']))
	+']</a><a href="//steamcommunity.com/groups/SteamClientBeta#/swt-settings" title="Change in settings">📝</a></div>');
	$('#swt_setpricebtn').click(function(e){
		e.preventDefault();
		var item = W.SellItemDialog.m_item;
		var strMarketName = W.GetMarketHashName( item.description );
		getMarketPrice(item.appid, strMarketName)
		.done(data=>{
			var price = getPriceAsInt(data.lowest_price) + settings.cur.invSellItemSetPriceDiff;

			$('#market_sell_buyercurrency_input').val(W.v_currencyformat(price, W.GetCurrencyCode(W.g_rgWalletInfo['wallet_currency'])));
			W.SellItemDialog.OnBuyerPriceInputKeyUp();

		});


	});

	var sellWarningBlock = {};
	sellWarningBlock.el = $('#market_sell_dialog_item_availability_hint>.market_dialog_topwarning');
	sellWarningBlock.orgnText = sellWarningBlock.el.text();

	W.SellItemDialog.OnConfirmationAccept_old = W.SellItemDialog.OnConfirmationAccept;
	W.SellItemDialog._swt_OnConfirmationAccept_next = W.SellItemDialog.OnConfirmationAccept;
	// Very low price check
	W.SellItemDialog.OnConfirmationAccept = function(event){
		var typedPriceInt = W.SellItemDialog.GetBuyerPriceAsInt();
		if(!typedPriceInt) {
			W.SellItemDialog.OnFailure(event);
			return;
		}

		// TODO check while input price
		if(!settings.cur.invSellItemPriceCheckMaxDiscount){
			return W.SellItemDialog._swt_OnConfirmationAccept_next.call(W.SellItemDialog, event);
		}
		var item = W.SellItemDialog.m_item;
		var strMarketName = W.GetMarketHashName( item.description );
		getMarketPrice(item.appid, strMarketName)
		.done( function ( data ) {
			var curPriceInt;
			try {
				if(!data.success) throw 0;
				curPriceInt=getPriceAsInt(data.lowest_price) || (data.lowest_price= W.SellItemDialog.m_plotPriceHistory.data[0].max()[1]) *100;
				//TODO check orders
				if(!curPriceInt) throw 0;
			} catch(e){
				if(confirm(t('sellLowPriceCheck.warnTitle')+t('sellLowPriceCheck.loadErr'))) W.SellItemDialog._swt_OnConfirmationAccept_next.call(W.SellItemDialog, event);
				return;
			}

			var curDiscount = 100*(1-(typedPriceInt/curPriceInt));

			function myConfirm(){
				var confText=t('sellLowPriceCheck.warnTitle')+t('sellLowPriceCheck.warning')+'\nyour price: '+W.$('market_sell_buyercurrency_input').value+' ('+W.$('market_sell_currency_input').value+') \ncurrent price: '+data.lowest_price+' \nyour lower at '+Math.round(curDiscount)+'% = '+ (curPriceInt-typedPriceInt)/100;

				if(	curDiscount> 5 + settings.cur.invSellItemPriceCheckMaxDiscount ) { // require confirmation by typing if entered price is too low
					var confirmedPrice = prompt(confText+'\n'+t('sellLowPriceCheck.warning2')+': '+W.$('market_sell_buyercurrency_input').value);
					if(getPriceAsInt(confirmedPrice)==typedPriceInt) return true;
					alert(t('sellLowPriceCheck.warnTitle')+'❌');
					return false;
				} else {  // require simple confirmation if entered price is slightly low
					return confirm(confText);
				}
			}

			if(    (curPriceInt-typedPriceInt)<=2 // ignore -2 cent diff
				|| (curDiscount<settings.cur.invSellItemPriceCheckMaxDiscount)
				|| myConfirm()
			) {
				W.SellItemDialog._swt_OnConfirmationAccept_next.call(W.SellItemDialog, event);
			} else {
				W.SellItemDialog.OnFailure.call(W.SellItemDialog, event);
			}
		} ).fail(function() {
			if(confirm(t('sellLowPriceCheck.warnTitle')+t('sellLowPriceCheck.loadErr'))) {
				W.SellItemDialog._swt_OnConfirmationAccept_next.call(W.SellItemDialog, event);
			} else {
				W.SellItemDialog.OnFailure.call(W.SellItemDialog, event);
			}
		} );
	}

	var SellCurrentSelection_old = W.SellCurrentSelection;
	W.SellCurrentSelection = function(){
		sellWarningBlock.el.text(sellWarningBlock.orgnText);
		var res = SellCurrentSelection_old.apply(this, arguments);
		var count = W.g_ActiveInventory.selectedItem._amount;
		var amount;

		if(count>1 && ( amount = Math.min( parseInt(prompt(t('howmany')+count, count)) || 1, count ) ) >1 ) {

			W.SellItemDialog._amount=amount;
			W.SellItemDialog._itemNum=0;
			W.SellItemDialog._itemsFailNum=0;
			W.SellItemDialog.OnConfirmationAccept_new = function(event){
				W.SellItemDialog._swt_OnConfirmationAccept_next = W.SellItemDialog.OnConfirmationAccept_old; // for compatibility with other extensions
				W.$('market_sell_dialog_error').hide();
				W.$('market_sell_dialog_ok').fade({duration:0.25});
				W.$('market_sell_dialog_back').fade({duration:0.25});
				W.$('market_sell_dialog_throbber').show().fade({duration:0.25,from:0,to:1});

				var item;
				do {
				item = W.SellItemDialog.m_item._subItems[W.SellItemDialog._itemNum++];
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
					if(!data.success) ++W.SellItemDialog._itemsFailNum;
					sellWarningBlock.el.text(
						t('listed')+ W.SellItemDialog._itemNum +' / '+amount+
						(W.SellItemDialog._itemsFailNum ? ' | '+t('skipped')+W.SellItemDialog._itemsFailNum : '')
					);
					if(W.SellItemDialog._itemNum>=W.SellItemDialog._amount)
						W.SellItemDialog.OnSuccess.call(W.SellItemDialog, { responseJSON: data })
					else {
						return W.SellItemDialog.OnConfirmationAccept_new.apply(W.SellItemDialog, arguments);
					}
				} ).fail( function( jqxhr ) {
					// jquery doesn't parse json on fail
					try { // no JSON on 500 erros
						var data = { responseJSON: JSON.parse( jqxhr.responseText ) };
					} finally {
						W.SellItemDialog._itemsFailNum++;
						if(W.SellItemDialog._itemNum>=W.SellItemDialog._amount)
							W.SellItemDialog.OnFailure( data || {} );
						else {
							return W.SellItemDialog.OnConfirmationAccept_new.apply(W.SellItemDialog, arguments);
						}
					}
				} );

			}
			W.SellItemDialog._swt_OnConfirmationAccept_next = W.SellItemDialog.OnConfirmationAccept_new;

		} else
			W.SellItemDialog._swt_OnConfirmationAccept_next = W.SellItemDialog.OnConfirmationAccept_old;

		return res;
	}
}


if (W.g_bIsInventoryPage) {
	if (!W.CInventory.prototype.LoadCompleteInventory) return; // fix for old scripts in ?modal=1&market=1
	inventoryPageInit();
}
