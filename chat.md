# ⭐ How your database looks
Chat Collection <br/>
_id         | members	        | LastMessage <br>
chatId123   | [userA, userB]	| messageId789

# Message Collection: Each time the sender changes
_id	    |chatId	    |sender	|textMessage	|createdAt <br>
msg1	| chatId123	 |userA	 |"Hi"	    ... <br>
msg2	| chatId123	 |userB	 |"Hello"	    ... <br>
msg3	| chatId123	 |userA	 |"How are you?" <br>