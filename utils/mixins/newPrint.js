const printerPlugin = uni.requireNativePlugin('Hd-PrintModule')
import { showText } from '@/utils/util.js'
module.exports = {
  data() {
    return {}
  },
  onLoad() {
    printerPlugin.initPrint((result) => {
      console.log('initPrint', result)
      printerPlugin.printEnableMark(true)
    })
  },
  methods: {

	newPrintTextDcs(data, times = 1, VOID = false,dcs_base64 = '') {
	  console.log(data);
	  console.log(times);
	  console.log("bbbbbbbbbbbbbb")
	  let printStatus = uni.getStorageSync('printStatus')
	  if (printStatus == 2) {
	    showText('请开启打印小票功能')
	    return
	  }
	  let paper_title = "";
	  if(VOID == false){
		  paper_title = 'SALE';
	  }else{
		  let is_today = this.isToday(new Date(data.capturedTime));
		  if(is_today == true){//当天
			  paper_title = 'VOID SALE';
		  }else{
			  paper_title = 'REFUND';
		  }
	  }
	  try {
	    setTimeout(() => {
			this.print_info(data,paper_title,VOID,dcs_base64);
			let printTimes = uni.getStorageSync('printTimes') || false
			if (times > 1 && !printTimes) {
				setTimeout(() => {
					let is_cli_pause_three_seconds = uni.getStorageSync('is_cli_pause_three_seconds');
					if(is_cli_pause_three_seconds == 'no' || is_cli_pause_three_seconds == 'two_dayin'){
						this.print_info(data,paper_title,VOID,dcs_base64);
					}
				},5000);
			}
	    }, 300)
	  } catch (e) {
	    //TODO handle the exception
	    console.log(e, '-=-=')
	  }
	},
	print_info(data,paper_title,VOID,dcs_base64){
		let capturedTime = data.capturedTime;
		let capturedTimeArr = capturedTime.split(" ");
		let arr_year_month = capturedTimeArr[0].split("-");
		
		let textn = '\n';
		printerPlugin.setFontSize(20);
		printerPlugin.printBitmap(dcs_base64);
		printerPlugin.printText(textn);
		printerPlugin.setAlignment(1);
		printerPlugin.printText(uni.getStorageSync('storeName')+'\n');
		printerPlugin.printText(data.storeAddress+'\n');
		
		printerPlugin.setAlignment(0);
		printerPlugin.printText('DATE/TIME:'+arr_year_month[2]+'/'+arr_year_month[1]+'/'+arr_year_month[0]+'        '+capturedTimeArr[1]+'\n');
		printerPlugin.printText('--------------------------------------\n');
		printerPlugin.setAlignment(0);
		printerPlugin.printText('MID:'+data.dcsCardPrintInfoDto.mid+'     TID:'+data.dcsCardPrintInfoDto.tid+'\n');
		printerPlugin.printText('BATCH:'+data.dcsCardPrintInfoDto.batch+'            TRACE:'+data.dcsCardPrintInfoDto.trace+'\n');
		printerPlugin.printText('APPR CODE:\n');
		printerPlugin.printText('--------------------------------------\n');
		printerPlugin.setAlignment(1);
		printerPlugin.printText(paper_title+'\n');
		

		printerPlugin.setAlignment(0);
		printerPlugin.printText(data.acquirerTypeAbbreviation+'\n');
					
		printerPlugin.printText(data.dcsCardPrintInfoDto.cardNumber+'          EXP:'+data.dcsCardPrintInfoDto.exp+'\n');
		printerPlugin.printText('TYPE:'+data.cardPayWay+'   STAN:'+data.dcsCardPrintInfoDto.stan+'\n');
		printerPlugin.printText('RRN:'+data.dcsCardPrintInfoDto.rrn+'  AID:'+data.dcsCardPrintInfoDto.aid+'\n');
		printerPlugin.printText('APP:'+data.dcsCardPrintInfoDto.app+'   TC:'+data.dcsCardPrintInfoDto.tc+'\n');
		printerPlugin.printText(textn);
		if(VOID == false){
			printerPlugin.setFontSize(24);
			printerPlugin.printText('AMOUNT: S$ '+data.amount / 100+'\n');
			printerPlugin.printText('TIPS: S$ 0.00\n');
			printerPlugin.printText('TOTAL AMOUNT: S$ '+data.amount / 100+'\n');
		}else{
			printerPlugin.printText(textn);
			printerPlugin.printText(textn);
			printerPlugin.setFontSize(24);
			printerPlugin.printText('TOTAL AMOUNT: -S$ '+data.amount / 100+'\n');
		}
		printerPlugin.setFontSize(20);
		printerPlugin.printText('--------------------------------------\n');
		printerPlugin.setAlignment(1);
		printerPlugin.printText('SIGN: ==NO SIGNATURE REQUIRED==\n');
		printerPlugin.printText(textn);
		
		printerPlugin.setAlignment(0);
		printerPlugin.printText('I AGREE TO PAY THE ABOVE TOTAL AMOUNT\n');
		printerPlugin.printText('ACCORDING TO THE CARD ISSUER AGREEMENT\n');
		printerPlugin.printText(textn);
		printerPlugin.setAlignment(1);
		printerPlugin.printText('THANK YOU. HAVE A NICE DAY\n');
		
		
		printerPlugin.printText(textn);
		printerPlugin.printText(textn);
		printerPlugin.printText(textn);
		printerPlugin.printText(textn);
		printerPlugin.printText(textn);
		printerPlugin.printText(textn);
		printerPlugin.printStart();
		
		
		
	},
    newPrintText(data, times = 1, duplicate = false, VOID = false,dcs_base64 = '',solana_pay_base64 = '') {
	  let _this = this;
      console.log(data);
	  console.log(times);
	  console.log("aaaaaaaaaaaaaaaaa")
      let printStatus = uni.getStorageSync('printStatus')
      if (printStatus == 2) {
        showText('请开启打印小票功能')
        return
      }
      try {
        setTimeout(() => {
          console.log(printerPlugin, 'printerPlugin')
          let acquirerTypeAbbreviation = ''
          if (data.acquirerTypeAbbreviation) {
            acquirerTypeAbbreviation =
              data.acquirerTypeAbbreviation.toUpperCase() == 'ALIPAY'
                ? 'Alipay+'
                : data.acquirerTypeAbbreviation
          }
          let text0 = '--Duplicate Receipt--\n'
          let text1 = acquirerTypeAbbreviation + '\n'
          let text2 = ''
          if (data.storeName == '') {
            text2 = '\n'
          } else {
            text2 = data.storeName + '\n'
          }
          let text3 = 'Date(日期)：' + data.lastUpdateTime + '\n'
          let text4 = data.id + '\n'
          let text5 = 'Channel(支付渠道)：' + acquirerTypeAbbreviation + '\n'
          let text6 = 'Ref(参考号)：' + data.acquirerTransactionId + '\n'
          let text7 = 'TOTAL SGD(新币)：' + data.amount / 100 + '\n'
          let text8 = 'Signature(签名) \n'
          let text9 = '\n'
          let text10 =
            'I ACKNOWLEDGE SATISFACTORY \n RECEIPT OF RELATIVE \n GOODS/SERVICES \n --- MERCHANT COPY ---\n'
          printerPlugin.setAlignment(1)
          // printerPlugin.setTextSize(25);
		  
		  if (dcs_base64 != '') {
		    printerPlugin.printBitmap(dcs_base64);
		  }

          let text_top = '-----------------\n'
          printerPlugin.printText(text_top)
          // 新增VOID
          if (VOID) {
            printerPlugin.printText('VOID\n')
          }
          if (duplicate) {
            printerPlugin.printText(text0)
          }
          printerPlugin.printText(text1)
          printerPlugin.printText(text2)
          printerPlugin.printText(text3)
          printerPlugin.printText(text4)
          printerPlugin.printText(text5)
          printerPlugin.printText(text6)
          printerPlugin.printText(text7)
          printerPlugin.printText(text8)
          printerPlugin.printText(text9)
          printerPlugin.printText(text10)
		  if(data.acquirerType == "SOLANA_PAY"){
			  printerPlugin.printText(text9);
			  printerPlugin.printBitmap(solana_pay_base64);
		  }
          printerPlugin.printText(text9)
          printerPlugin.printText(text9)
          printerPlugin.printText(text9)
          printerPlugin.printText(text9)
          printerPlugin.printText(text9)
          printerPlugin.printText(text9)
          printerPlugin.printText(text9)
          printerPlugin.printText(text9)
          printerPlugin.printStart()

          let printTimes = uni.getStorageSync('printTimes') || false
          if (times > 1 && !printTimes) {
            setTimeout(() => {
				let is_cli_pause_three_seconds = uni.getStorageSync('is_cli_pause_three_seconds');
				if(is_cli_pause_three_seconds == 'no' || is_cli_pause_three_seconds == 'two_dayin'){
					
					printerPlugin.setAlignment(1)
					if (dcs_base64 != '') {
					  printerPlugin.printBitmap(dcs_base64);
					}
					
					// 新增VOID
					if (VOID) {
					  printerPlugin.printText('VOID\n')
					}
					// printerPlugin.setTextSize(25);
					if (duplicate) {
					  printerPlugin.printText(text0)
					}
					printerPlugin.printText(text1)
					printerPlugin.printText(text2)
					printerPlugin.printText(text3)
					printerPlugin.printText(text4)
					printerPlugin.printText(text5)
					printerPlugin.printText(text6)
					printerPlugin.printText(text7)
					printerPlugin.printText(text8)
					printerPlugin.printText(text9)
					
					let text10 =
					  'I ACKNOWLEDGE SATISFACTORY \n RECEIPT OF RELATIVE \n GOODS/SERVICES \n --- CUSTOMER COPY ---\n'
					printerPlugin.printText(text10)
					if(data.acquirerType == "SOLANA_PAY"){
									printerPlugin.printText(text9);
						printerPlugin.printBitmap(solana_pay_base64);
					}
					printerPlugin.printText(text9)
					printerPlugin.printText(text9)
					printerPlugin.printText(text9)
					printerPlugin.printText(text9)
					printerPlugin.printText(text9)
					printerPlugin.printText(text9)
					printerPlugin.printText(text9)
					printerPlugin.printText(text9)
					// printerPlugin.printAndFeedPaper(100);
					printerPlugin.printStart()	
				}
              
            }, 5000);
          }
        }, 300)
      } catch (e) {
        //TODO handle the exception
        console.log(e, '-=-=')
      }
    },

    newPrintTextSummarySunmi(list,dcs_base64) {
      let printStatus = uni.getStorageSync('printStatus')
      if (printStatus == 2) {
        showText('请开启打印小票功能')
        return
      }
      
      if (list.length > 0) {
		  printerPlugin.setFontSize(20);
        list.map((r) => {
          // var cmd2 = [0x1b, 0x33, 0x00]
		  
          let acquirerTypeString =
            r.acquirerTypeString.toUpperCase() == 'ALIPAY'
              ? 'ALIPAY+'
              : r.acquirerTypeString;
		  if(acquirerTypeString == "DCS_CARD_NOW_PAY_OFFLINE"){
			  
			  //visa
			  let transactionNumberVisa = this.get_number(r.transactionNumberVisa);
			  let sumAmountVisa = this.get_amount(5,r.sumAmountVisa);
			
			  let refundNumberVisa = this.get_number(r.refundNumberVisa);
			  let sumRefundAmountVisa = this.get_amount(6,r.sumRefundAmountVisa);
			  
			  let cardTotalNumberVisa = this.get_number(r.cardTotalNumberVisa);
			  let cardTotalAmountVisa = this.get_amount(3,r.cardTotalAmountVisa);
			  
			  
			  //master
			  let transactionNumberMaster = this.get_number(r.transactionNumberMaster);
			  let sumAmountMaster = this.get_amount(5,r.sumAmountMaster);
			  
			  let refundNumberMaster = this.get_number(r.refundNumberMaster);
			  let sumRefundAmountMaster = this.get_amount(6,r.sumRefundAmountMaster);  
			  
			  let cardTotalNumberMaster = this.get_number(r.cardTotalNumberMaster);
			  let cardTotalAmountMaster = this.get_amount(3,r.cardTotalAmountMaster);
			  
			  
			  //batch
			  let saleBatchTotalTransactionNumber = this.get_number(r.saleBatchTotalTransactionNumber);
			  let saleBatchTotalTransactionAmount = this.get_amount(5,r.saleBatchTotalTransactionAmount);
						
			  let refundBatchTotalTransactionNumber = this.get_number(r.refundBatchTotalTransactionNumber);
			  let refundBatchTotalTransactionAmount = this.get_amount(6,r.refundBatchTotalTransactionAmount);
			  
			  let cardBatchTotalTransactionNumber = this.get_number(r.cardBatchTotalTransactionNumber);
			  let grandTotal = this.get_amount(3,r.grandTotal);
			  
			  
			  //uniou
			  let transactionNumberUnion = this.get_number(r.transactionNumberUnion); 
			  let sumAmountUnion = this.get_amount(5,r.sumAmountUnion);
					  
			  let refundNumberUnion = this.get_number(r.refundNumberUnion);
			  let sumRefundAmountUnion = this.get_amount(6,r.sumRefundAmountUnion);
			  
			  let cardTotalNumberUnion = this.get_number(r.cardTotalNumberUnion);
			  let cardTotalAmountUnion = this.get_amount(3,r.cardTotalAmountUnion);
		
			  
			  //dines
			  let transactionNumberDines = this.get_number(r.transactionNumberDines);
			  let sumAmountDines = this.get_amount(5,r.sumAmountDines);
			  						  
			  let refundNumberDines = this.get_number(r.refundNumberDines);
			  let sumRefundAmountDines = this.get_amount(6,r.sumRefundAmountDines);
			  
			  let cardTotalNumberDines = this.get_number(r.cardTotalNumberDines);
			  let cardTotalAmountDines = this.get_amount(3,r.cardTotalAmountDines);
			  
			  if(r.storeDcsConfigurationDto){
				  printerPlugin.printBitmap(dcs_base64);
				  printerPlugin.setAlignment(1);
				  printerPlugin.printText(r.storeDto.name+'\n');
				  printerPlugin.printText(r.storeDto.address+'\n');
				  printerPlugin.printText('\n');
				  printerPlugin.setAlignment(0);
				  printerPlugin.printText('DATE/TIME:        '+r.dateString+'\n');
				  printerPlugin.printText('TID:'+r.storeDcsConfigurationDto.dcsMerchantId+'\n');
				  printerPlugin.printText('MID:'+r.storeDcsConfigurationDto.dcsTerminalId+'\n');
				  printerPlugin.printText('HOST:DSC\n');
				  printerPlugin.setAlignment(1);
				  printerPlugin.printText('TOTAL REPORT\n');
				  printerPlugin.setAlignment(0);
				  printerPlugin.printText('TRANS        COUNT        AMOUNT(SGD)\n');
				  printerPlugin.setAlignment(1);
				  printerPlugin.printText('======================================\n');
				  
				  
				  
				  printerPlugin.setAlignment(0);
				  printerPlugin.printText('VISA\n');
				  printerPlugin.printText('SALES         '+transactionNumberVisa+'     '+sumAmountVisa+'\n');
				  printerPlugin.printText('REFUND        '+refundNumberVisa+'    '+sumRefundAmountVisa+'\n');
				  printerPlugin.printText('TIP           000               0.00\n');
				  printerPlugin.printText('CARD TOTAL    '+cardTotalNumberVisa+'     '+cardTotalAmountVisa+'\n');
				  printerPlugin.printText('\n');
				  
				  printerPlugin.printText('MASTERCARD\n');
				  printerPlugin.printText('SALES         '+transactionNumberMaster+'     '+sumAmountMaster+'\n');
				  printerPlugin.printText('REFUND        '+refundNumberMaster+'    '+sumRefundAmountMaster+'\n');
				  printerPlugin.printText('TIP           000               0.00\n');
				  printerPlugin.printText('CARD TOTAL    '+cardTotalNumberMaster+'     '+cardTotalAmountMaster+'\n');
				  printerPlugin.printText('\n');
				  
				  printerPlugin.printText('UNIONCARD\n');
				  printerPlugin.printText('SALES         '+transactionNumberUnion+'     '+sumAmountUnion+'\n');
				  printerPlugin.printText('REFUND        '+refundNumberUnion+'    '+sumRefundAmountUnion+'\n');
				  printerPlugin.printText('TIP           000               0.00\n');
				  printerPlugin.printText('CARD TOTAL    '+cardTotalNumberUnion+'     '+cardTotalAmountUnion+'\n');
				  printerPlugin.printText('\n');
				  
				  printerPlugin.printText('DINESCARD\n');
				  printerPlugin.printText('SALES         '+transactionNumberDines+'     '+sumAmountDines+'\n');
				  printerPlugin.printText('REFUND        '+refundNumberDines+'    '+sumRefundAmountDines+'\n');
				  printerPlugin.printText('TIP           000               0.00\n');
				  printerPlugin.printText('CARD TOTAL    '+cardTotalNumberDines+'     '+cardTotalAmountDines+'\n');
				  printerPlugin.printText('\n');
				  
				  printerPlugin.printText('BATCH TOTALS:\n');
				  printerPlugin.printText('SALES         '+saleBatchTotalTransactionNumber+'     '+saleBatchTotalTransactionAmount+'\n');
				  printerPlugin.printText('REFUND        '+refundBatchTotalTransactionNumber+'    '+refundBatchTotalTransactionAmount+'\n');
				  printerPlugin.printText('TIP           000               0.00\n');
				  printerPlugin.printText('CARD TOTAL    '+cardBatchTotalTransactionNumber+'     '+grandTotal+'\n');
				  
			  }
			  
			  printerPlugin.setAlignment(1);
			  printerPlugin.printText('*** DUPLICATE COPY ***\n');
		  }else{
			  
			  let text1 = acquirerTypeString + '\n'
			  let text2 = 'startTimeString：' + r.startTimeString + '\n'
			  let text3 = 'endTimeString：' + r.endTimeString + '\n'
			  let text4 = 'dateString：' + r.dateString + '\n'
			  let text5 = 'transactionAmount：' + r.transactionAmount + '\n'
			  let text6 = 'transactionNumber：' + r.transactionNumber + '\n\n\n\n\n'
			  
			  if(r.acquirerType == "DCS_CARD_NOW_PAY"){
			  			  printerPlugin.printBitmap(dcs_base64);
			  }
			  // printerPlugin.printRawData(cmd2);
			  printerPlugin.printText(text1)
			  printerPlugin.printText(text2)
			  printerPlugin.printText(text3)
			  printerPlugin.printText(text4)
			  printerPlugin.printText(text5)
			  printerPlugin.printText(text6)
			  
		  }
          
          printerPlugin.printStart()
        })
        let text7 = '\n'
        printerPlugin.printText(text7)
        printerPlugin.printText(text7)
        printerPlugin.printText(text7)
        printerPlugin.printText(text7)
        printerPlugin.printText(text7)
        printerPlugin.printStart()
		
      }
    },
	isToday(date) {
		const today = new Date();
		return date.getFullYear() === today.getFullYear() &&
			 date.getMonth() === today.getMonth() &&
			 date.getDate() === today.getDate();
	},
	get_amount(size_length,number){
		if(size_length == 5){
			var kongge = '';
		}else if(size_length == 6){
			var kongge = ' ';
		}else if(size_length == 3){
			var kongge = '';
		}
		if(number == 0){
			number = "          "+kongge+"0.00";
		}else{
			number = number / 100;
			if(number < 10){
							  number = '          '+kongge+number;
			}else if(number < 100){
							  number = '         '+kongge+number;
			}else if(number < 1000){
							  number = '        '+kongge+number;
			}else if(number < 10000){
							  number = '       '+kongge+number;
			}else if(number < 10000){
							  number = '      '+kongge+number;
			}
		}
		return number;
	},
	get_number(number){
		number = number.toString().padStart(3, '0');
		return number;
	},
  },
}
