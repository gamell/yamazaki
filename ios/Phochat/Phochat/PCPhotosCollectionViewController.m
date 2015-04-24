//
//  PCPhotosCollectionViewController.m
//  Phochat
//
//  Created by Daniel Koh on 4/23/15.
//  Copyright (c) 2015 Carunaga. All rights reserved.
//

#import "PCPhotosCollectionViewController.h"
#import "SimpleCam.h"
#import <Parse/Parse.h>

@interface PCPhotosCollectionViewController ()<SimpleCamDelegate>

@end

@implementation PCPhotosCollectionViewController

static NSString * const reuseIdentifier = @"Cell";

- (void)viewDidLoad {
    [super viewDidLoad];
    
    // Uncomment the following line to preserve selection between presentations
    // self.clearsSelectionOnViewWillAppear = NO;
    
    // Register cell classes
    [self.collectionView registerClass:[UICollectionViewCell class] forCellWithReuseIdentifier:reuseIdentifier];
    
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)didTapPhotosButton:(id)sender
{
    SimpleCam * simpleCam = [[SimpleCam alloc]init];
    simpleCam.delegate = self;
    [self presentViewController:simpleCam animated:YES completion:nil];
}

- (void)simpleCam:(SimpleCam *)simpleCam didFinishWithImage:(UIImage *)image {
    
    if (image) {
        NSData *imageData = UIImageJPEGRepresentation(image, 0.3);
        PFFile *imageFile = [PFFile fileWithName:@"test-image.png" data:imageData];
        
        PFObject *userPhoto = [PFObject objectWithClassName:@"UserPhoto"];
        userPhoto[@"imageName"] = @"Some name";
        userPhoto[@"imageFile"] = imageFile;
        userPhoto[@"eventIdentifier"] = @"event-id";
        if ([PFUser currentUser])
        {
            userPhoto[@"user"] = [PFUser currentUser];
        }
        [userPhoto saveInBackground];
    }
    else {
        NSLog(@"SimpleCam is cancelled ");
    }
    
    // Close simpleCam - use this as opposed to dismissViewController: to properly end photo session
    [simpleCam closeWithCompletion:^{
        NSLog(@"SimpleCam is done closing ... ");
        // It is safe to launch other ViewControllers, for instance, an editor here.
    }];
}

- (void) simpleCamNotAuthorizedForCameraUse:(SimpleCam *)simpleCam
{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"No camera" message:@"Not authorized" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
    [alert show];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

#pragma mark <UICollectionViewDataSource>

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
#warning Incomplete method implementation -- Return the number of sections
    return 0;
}


- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
#warning Incomplete method implementation -- Return the number of items in the section
    return 0;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    UICollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:reuseIdentifier forIndexPath:indexPath];
    
    // Configure the cell
    
    return cell;
}



#pragma mark <UICollectionViewDelegate>

/*
// Uncomment this method to specify if the specified item should be highlighted during tracking
- (BOOL)collectionView:(UICollectionView *)collectionView shouldHighlightItemAtIndexPath:(NSIndexPath *)indexPath {
	return YES;
}
*/

/*
// Uncomment this method to specify if the specified item should be selected
- (BOOL)collectionView:(UICollectionView *)collectionView shouldSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    return YES;
}
*/

/*
// Uncomment these methods to specify if an action menu should be displayed for the specified item, and react to actions performed on the item
- (BOOL)collectionView:(UICollectionView *)collectionView shouldShowMenuForItemAtIndexPath:(NSIndexPath *)indexPath {
	return NO;
}

- (BOOL)collectionView:(UICollectionView *)collectionView canPerformAction:(SEL)action forItemAtIndexPath:(NSIndexPath *)indexPath withSender:(id)sender {
	return NO;
}

- (void)collectionView:(UICollectionView *)collectionView performAction:(SEL)action forItemAtIndexPath:(NSIndexPath *)indexPath withSender:(id)sender {
	
}
*/

@end
