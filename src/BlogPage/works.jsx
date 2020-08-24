import React from "react";

import style from "./style.module.scss";
export default class Works extends React.Component {
  render() {
    return (
      <section id="works" className={style.section}>
        <div className={style["marginbot-50"]}>
          <div className="animatedParent">
            <div className="section-heading text-center">
              <h2 className="h-bold animated bounceInDown">個人著作</h2>
              <div className={style["divider-header"]}></div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row animatedParent">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <div className="service-desc">
                <h5>期刊論文</h5>
                <div></div>
                <p align="left">
                  1.  Chun-I Fan, Ming-Te Chen, Yu-Kuang Liang, Long-Sian Chen, “Truly Anonymous Paper Submission and Review Scheme”, Transactions on Data Privacy 7:3 (2014) 283 – 308.
                </p>
                <p align="left">
                  2.  Ming-Te Chen, Chun-I Fan, Wen-Shenq Juang and Yi-Chun Yeh, “An Efficient Electronic Cash Scheme with Mutiple Banks using Group Signature,’’ International Journal of Innovative Computing, Information and Control, vol. 8, no. 6, June, 2012. (SCI, Impact factor=1.67).
                </p>
                <p align="left">
                  3. Chun-I Fan, Wen-Shenq Juang, and Ming-Te Chen, “P2P Fair Content Exchange with Ownership Transfer,’’ International Journal of Innovative Computing, Information and Control, vol. 8, no. 5, May 2012. (SCI, Impact factor=1.67)
                </p>
                <p align="left">
                  4. Wen-Shenq Juang, Chun-I Fan, and Ming-Te Chen, “Efficient Fair Content Exchange with Robust Watermark Ownership,’’ International Journal of Innovative Computing, Information and Control, vol. 7, no. 9, 2011. (SCI, Impact factor=1.67)
                </p>
                <p align="left">
                  5. Chun-I Fan, Ming-Te Chen, and Wei-Zhe Sun, “Buyer-Seller Watermarking Protocols with Off-Line Trusted Third Parties’’ The International Journal of Ad Hoc and Ubiquitous Computing, vol. 4, no. 1, 2009, pp. 36-43. (SCI, EI) NSC 96-2219-E-110-002
                </p>
                <p align="left">
                  6. Chun-I Fan and Ming-Te Chen, “A Secure Blind Signature Scheme for Computation Limited Users,’’ International Journal of Applied Mathematics and Computer Sciences, vol. 5, no. 1, 2009, pp. 6-10.
                </p>
                <p align="left">
                  7. Chun-I Fan, Chun-Liang Chang, Ming-Te Chen, and Pei-Hsiu Ho, “Anonymous Electronic Lottery Protocol,’’ Journal of Computers, vol. 20, no. 2, 2009, pp. 58~67.
                </p>
                <p align="left">
                  8. Ming-Hsin Chang, I-Te Chen*, and Ming-Te Chen, “Design of Proxy signature in ECDSA,” Journal of Information Assurance and Security (JIAS), Vol.5 Issue 1, pp. 360-366. 2010.
                </p>
              </div>
              <div className="service-desc">
                <h5>會議論文</h5>
                <div className="divider-header"></div>
                <p align="left">
                  1. Ming-Te Chen, Hao-Yu Liu, Chien-Hung Lai, Wen-Shiang Wang, and Chao-Yang Huang, “A Secure User Authenticated Scheme in Intelligent Manufacturing System,” Proceedings of the International Computer Symposium,(accepted) 2018
                    </p>
                <p align="left">
                  2. Chun-I Fan, Wen-Shenq Juang, and Ming-Te Chen, “Efficient Fair Content Exchange in Cloud Computing,” Proceedings of the International Computer Symposium, 2010. (EI)</p>
                <p align="left">
                  3. Chun-I Fan, Ming-Te Chen, and Lung-Hsien Chen, “Truly Anonymous Paper Submission and Review Scheme,” Proceedings of the Third International Workshop on Advances in Information Security, 2009, pp. 960-965.</p>
                <p align="left">
                  4. Chun-I Fan, Ming-Te Chen, and Wei-Zhe Sun, “Buyer-Seller Watermarking Protocols with Off-line Trusted Parties,’’ Proceedings of the First International Conference on Multimedia and Ubiquitous Engineering, 2007, pp. 1035-1040. (EI)</p>
                <p align="left">
                  5. Chun-I Fan and Ming-Te Chen, “An Attack on Untraceable Blind Signature Scheme,” Proceedings of the National Computer Symposium, 2003, pp. 1288~1290.</p>
                <p align="left">
                  6. Ming-Hsin Chang and I-Te Chen, Ming-Te Chen “Proxy-protected signature scheme based on the ECDSA,”  (ISDA 2008) Vol.3 pp. 17~22, 2008.11.26-28.</p>
                <p align="left">
                  7. 李正崙, 朱慧媛, 孫靖婷, 楊縢清, 廖晏辰, 莊峻鴻, 陳以德*, 陳明德, “結合憑證之安全電子病歷傳輸系統,” 全國計算機會議National Computer Symposium (NCS 2009), 2009.11.27~28</p>
              </div>
              <div className="service-desc">
                <h5>著作專書</h5>
                <div className="divider-headers"></div>
                <p align="left">
                  1.  陳以德、陳明德、簡文山, "可攜性電子病歷保護," 資通安全專論, T97014, 行政院國家科學委員會科學技術資料中心, 2009.
                  </p>
              </div>
            </div>
          </div>
        </div>

      </section>
    );
  }
}