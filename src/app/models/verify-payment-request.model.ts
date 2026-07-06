export interface VerifyPaymentRequest {

    addressId: number;

    razorpayOrderId: string;

    razorpayPaymentId: string;

    razorpaySignature: string;

}